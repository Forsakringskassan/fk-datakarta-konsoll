import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Node } from '@vue-flow/core'

export const useNodeStore = defineStore('node', () => {
  const selectedNode = ref<Node | null>(null)

  function selectNode(node: Node) {
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
