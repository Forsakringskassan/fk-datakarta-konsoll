import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import type { ModelNodeData } from '@/model/types'

import { buildVueFlowModel } from '@/model/vueFlowMapper'
import { upperRepository } from '@/model/upperRepository'

export const useNodeStore = defineStore('node', () => {
  const nodes = ref<Node<ModelNodeData>[]>([])
  const edges = ref<Edge[]>([])
  const domainName = ref('')
  const selectedNodeId = ref<string | null>(null)
  const selectedNode = computed<ModelNodeData | null>(() => {
    if (!selectedNodeId.value) {
      return null
    }

    return nodes.value.find((node) => node.id === selectedNodeId.value)?.data ?? null
  })

  function rebuildFromRdf() {
    const model = buildVueFlowModel(upperRepository)

    nodes.value = model.nodes
    edges.value = model.edges
    domainName.value = model.domainName
  }

  function selectNode(id: string): void {
    const node = nodes.value.find((node) => node.id === id)

    selectedNodeId.value = node ? id : null
  }

  return {
    nodes,
    edges,
    domainName,
    selectedNode,
    selectNode,
    rebuildFromRdf,
  }
})
