<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Background } from '@vue-flow/background'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { ControlButton, Controls } from '@vue-flow/controls'
import type { Node, Edge } from '@vue-flow/core'

import EnumerationNode from '@/components/EnumerationNode.vue'
import SchemaNode from '@/components/SchemaNode.vue'
import ModalNyRelation from '@/components/ModalNyRelation.vue'

import { useModal } from '@fkui/vue'
import { useNodeStore } from '@/stores/node'
import { useModelStore } from '@/stores/model'
import { useLayout } from '@/util/layout'

const { layout } = useLayout()

const nodeStore = useNodeStore()
const modelStore = useModelStore()

const { addEdges, fitView, getViewport, onNodeClick } = useVueFlow()
const { formModal } = useModal()

const fileInput = ref<HTMLInputElement | null>(null)

const nodes = computed(() => modelStore.nodes)
const edges = computed(() => modelStore.edges)
const domainName = computed(() => modelStore.domainName)

function openFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    modelStore.loadTurtle(reader.result as string)
  }

  reader.readAsText(file)
}

async function layoutGraph() {
  await nextTick()

  modelStore.nodes = await layout(modelStore.nodes, modelStore.edges)
}

function addSchemaNode() {
  const { x, y } = getViewport()

  const id = `schema-${Date.now()}`

  const newNode: Node = {
    id,
    type: 'schema-node',
    position: {
      x,
      y,
    },
    data: {
      label: 'New Schema',
      properties: [
        {
          name: 'id',
          type: 'string',
          description: '',
        },
      ],
    },
  }

  modelStore.nodes.push(newNode)
}

onNodeClick(({ event, node }) => {
  nodeStore.selectNode(node)
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

    addEdges({
      id: `edge-${Date.now()}`,
      type: 'smoothstep',
      source: connection.source,
      target: connection.target,
      label: result.label,
    })
  } catch {
    // cancelled
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
  link.download = `${modelStore.domainName || 'model'}.ttl`

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

    <h2 v-if="domainName">Domain: {{ domainName }}</h2>

    <div class="flow-container">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :min-zoom="0.01"
        @nodes-initialized="layoutGraph"
        @node-click="onNodeClick"
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
