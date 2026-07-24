<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { useModal } from '@fkui/vue'
import { FButton } from '@fkui/vue'

import type { EnumerationNodeData } from '@/model/types'

const { removeNodes } = useVueFlow()
const { confirmModal } = useModal()

const props = defineProps<{
  id: string
  data: EnumerationNodeData
}>()

const editingLabel = ref(false)
const labelInput = ref(props.data.label)
const labelInputRef = ref<HTMLInputElement | null>(null)

const actions = ['Lägg till värde', 'Ta bort']

async function startEditing() {
  labelInput.value = props.data.label
  editingLabel.value = true

  await nextTick()
  labelInputRef.value?.focus()
}

function saveLabel() {
  props.data.label = labelInput.value
  editingLabel.value = false
}

function addValue() {
  props.data.values.push({
    id: `enum-value-${Date.now()}`,
    label: 'New value',
  })
}

async function deleteNode() {
  const confirmed = await confirmModal({
    heading: 'Ta bort enumeration',
    content: `Är du säker på att du vill ta bort "${props.data.label}"?`,
    confirm: 'Ja, ta bort',
    dismiss: 'Nej, behåll',
  })

  if (confirmed) {
    removeNodes(props.id)
  }
}

function handleToolbarAction(action: string) {
  if (action === 'Lägg till värde') {
    addValue()
  }

  if (action === 'Ta bort') {
    deleteNode()
  }
}

function cancelEditing() {
  editingLabel.value = false
}
</script>

<template>
  <div class="enum-node nopan">
    <div class="enum-header"></div>

    <h3 v-if="!editingLabel" @click="startEditing" class="editable-label">
      {{ props.data.label }}
    </h3>

    <input
      v-else
      ref="labelInputRef"
      v-model="labelInput"
      class="label-input"
      @keyup.enter="saveLabel"
      @keyup.escape="cancelEditing"
      @blur="saveLabel"
    />

    <div v-for="value in props.data.values" :key="value.id" class="enum-value">
      <input v-model="value.label" />
    </div>

    <NodeToolbar :is-visible="data.toolbarVisible" :position="Position.Bottom">
      <f-button
        variant="primary"
        size="small"
        v-for="action of actions"
        :key="action"
        @click="handleToolbarAction(action)"
      >
        {{ action }}
      </f-button>
    </NodeToolbar>

    <Handle id="source" type="source" :position="Position.Right" />

    <Handle id="target" type="target" :position="Position.Left" />
  </div>
</template>

<style scoped>
.enum-node {
  background: #f4f4f4;
  border: 1px solid #888;
  border-radius: 6px;
  min-width: 200px;
}

.enum-header {
  height: 10px;
  background: var(--fkds-color-header-background-primary);
  border-radius: 6px 6px 0 0;
}

.editable-label {
  padding: 10px;
  cursor: text;
}

.label-input {
  margin: 10px;
}

.enum-value {
  padding: 5px 10px;
  border-top: 1px solid #ddd;
}

.enum-value input {
  width: 100%;
}
</style>
