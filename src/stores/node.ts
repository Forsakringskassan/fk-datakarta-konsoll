import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Node } from '@vue-flow/core'
import type { ModelNodeData } from '@/model/types'

type ModelNode = Node<ModelNodeData>

export const useNodeStore = defineStore('node', () => {
  const selectedNode = ref<ModelNodeData | null>(null)

  function selectNode(node: Node<ModelNode>) {
    selectedNode.value = node
  }

  function clearSelection() {
    selectedNode.value = null
  }

  return {
    selectedNode,
    selectNode,
    clearSelection,
  }
})
