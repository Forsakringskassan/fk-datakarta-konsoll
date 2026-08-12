<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { useModal } from '@fkui/vue'
import { FButton, FSelectField, FTextField } from '@fkui/vue'
import { useModelStore } from '@/stores/model'
import type { SchemaNodeData } from '@/model/types'

const { removeNodes } = useVueFlow()
const { confirmModal } = useModal()
const modelStore = useModelStore()

const fieldTypes = ['string', 'integer', 'boolean', 'dateTime', 'long', 'double']

const props = defineProps<{
  id: string
  data: SchemaNodeData
  color?: string
}>()

const editingLabel = ref(false)
const labelInput = ref(props.data.label)
const labelInputRef = ref<HTMLInputElement | null>(null)

const actions = ['Lägg till', 'Ta bort']

async function startEditing() {
  labelInput.value = props.data.label
  editingLabel.value = true

  await nextTick()
  labelInputRef.value?.focus()
}

function saveLabel() {
  modelStore.updateLabel(props.id, labelInput.value)
  editingLabel.value = false
}

async function deleteNode() {
  const confirmed = await confirmModal({
    heading: 'Ta bort schema',
    content: `Är du säker på att du vill ta bort "${props.data.label}"?`,
    confirm: 'Ja, ta bort',
    dismiss: 'Nej, behåll',
  })

  if (confirmed) {
    removeNodes(props.id)
  }
}

function handleToolbarAction(action: string) {
  if (action === 'Lägg till') {
    modelStore.addAttribute(props.id, `property-${Date.now()}`)
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
  <div class="schema-node nopan">
    <div class="schema-node-header"></div>

    <div class="schema-node-content">
      <h3 v-if="!editingLabel" class="editable-label" @click="startEditing">
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

      <div v-for="(property, index) in props.data.properties" :key="index" class="property-row">
        <f-text-field v-model="property.label" inline> </f-text-field>

        <f-select-field v-if="property.kind === 'attribute'" v-model="property.datatype" inline>
          <option disabled hidden value="">Välj...</option>
          <option v-for="type in fieldTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </f-select-field>
      </div>
    </div>

    <NodeToolbar :is-visible="data.toolbarVisible" :position="Position.Bottom">
      <f-button
        v-for="action of actions"
        :key="action"
        variant="primary"
        size="small"
        type="button"
        @click="handleToolbarAction(action)"
      >
        {{ action }}
      </f-button>
    </NodeToolbar>

    <Handle id="source" type="source" :position="Position.Right" />

    <Handle id="target" type="target" :position="Position.Left" />
  </div>
</template>
