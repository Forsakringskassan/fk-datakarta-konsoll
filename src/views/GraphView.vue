<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Background } from '@vue-flow/background'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { ControlButton, Controls } from '@vue-flow/controls'
import type { Node } from '@vue-flow/core'

import EnumerationNode from '@/components/EnumerationNode.vue'
import SchemaNode from '@/components/SchemaNode.vue'
import ModalNyRelation from '@/components/ModalNyRelation.vue'
import type { EdgeChange } from '@vue-flow/core'

import { useModal } from '@fkui/vue'
import { useNodeStore } from '@/stores/node'
import { useModelStore } from '@/stores/model'
import { useLayout } from '@/util/layout'

const { layout } = useLayout()

const nodeStore = useNodeStore()
const modelStore = useModelStore()

const { addEdges, fitView, getViewport, onNodeClick, onPaneClick } = useVueFlow()
const { formModal } = useModal()

const fileInput = ref<HTMLInputElement | null>(null)

const nodes = computed(() => nodeStore.nodes)
const edges = computed(() => nodeStore.edges)
const domainName = computed(() => nodeStore.domainName)

function openFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()

  reader.onload = async () => {
    modelStore.loadTurtle(reader.result as string)
    nodeStore.rebuildFromRdf()
  }

  reader.readAsText(file)
}

async function layoutGraph() {
  await nextTick()

  nodeStore.nodes = await layout(nodeStore.nodes, nodeStore.edges)
}

function addSchemaNode() {
  const id = `schema-${Date.now()}`

  modelStore.addSchema(id, 'New Schema')
}

onNodeClick(({ node }) => {
  nodeStore.selectNode(node.id)
})

onPaneClick(() => {
  nodeStore.selectNode('')
})

async function onConnect(connection) {
  try {
    const result = await formModal(ModalNyRelation, {
      props: {
        value: {
          label: '',
        },
      },
    })

    modelStore.addRelationship(connection.source, connection.target, result.label)
  } catch {
    // cancelled
  }
}

function onEdgesChange(changes: EdgeChange[]) {
  for (const change of changes) {
    if (change.type === 'remove') {
      modelStore.removeRelationship(change.id)
    }
  }
}

async function save() {
  console.log(modelStore)
  const ttl = await modelStore.serialize()

  const blob = new Blob([ttl], {
    type: 'text/turtle',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${nodeStore.domainName || 'model'}.ttl`

  link.click()

  URL.revokeObjectURL(url)
}

function openFilePicker() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="editor">
    <input
      hidden
      ref="fileInput"
      type="file"
      accept=".ttl,.ttl.gz,text/turtle"
      @change="openFile"
    />

    <h2>Domain: "{{ domainName }}"</h2>

    <div class="flow-container">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :min-zoom="0.1"
        @nodes-initialized="layoutGraph"
        @edges-change="onEdgesChange"
        @connect="onConnect"
        fit-view-on-init
      >
        <Background pattern-color="#aaa" :gap="16" />

        <Controls position="top-left">
          <ControlButton title="Reset Transform" @click="fitView"> ↩️ </ControlButton>
          <ControlButton title="Add schema" @click="addSchemaNode"> Nytt dataobjekt </ControlButton>
          <ControlButton title="Import schema" @click="openFilePicker"> Importera </ControlButton>
          <ControlButton title="Save" @click="save"> Spara </ControlButton>
        </Controls>

        <template #node-schema-node="props">
          <SchemaNode :id="props.id" :data="props.data" />
        </template>

        <template #node-enumeration-node="props">
          <EnumerationNode :id="props.id" :data="props.data" />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<style scoped>
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flow-container {
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 1px solid #ccc;
}
</style>
