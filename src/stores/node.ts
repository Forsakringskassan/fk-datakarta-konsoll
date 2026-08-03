import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import type { ModelNodeData } from '@/model/types'

import { buildVueFlowModel } from '@/model/vueFlowMapper'
import { upperRepository } from '@/model/upperRepository'

export const useNodeStore = defineStore('node', () => {
  const nodes = ref<Node[]>([])
  const edges = ref<Edge[]>([])
  const domainName = ref('')
  const selectedNode = ref<ModelNodeData | null>(null)

  function rebuildFromRdf() {
    const model = buildVueFlowModel(upperRepository)

    nodes.value = model.nodes
    edges.value = model.edges
    domainName.value = model.domainName
  }

  function updateLabel(value: string) {
    if (selectedNode.value) {
      selectedNode.value.label = value
    }
  }

  function updateDescription(value: string) {
    if (selectedNode.value) {
      selectedNode.value.description = value
    }
  }

  function addAttribute(id: string) {
    const node = selectedNode.value

    if (node?.kind === 'schema') {
      node.properties.push({
        id,
        kind: 'attribute',
        label: 'Ny egenskap',
        minCount: 1,
        maxCount: 1,
        datatype: 'xsd:string',
      })
    }
  }

  return {
    nodes,
    edges,
    domainName,
    selectedNode,
    rebuildFromRdf,
    updateLabel,
    updateDescription,
    addAttribute,
  }
})
