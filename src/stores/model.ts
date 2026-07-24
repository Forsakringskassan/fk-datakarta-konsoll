// stores/model.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'

import { upperRepository } from '@/model/upperRepository'
import { buildVueFlowModel } from '@/model/vueFlowMapper'

export const useModelStore = defineStore('model', () => {
  const nodes = ref<Node[]>([])
  const edges = ref<Edge[]>([])
  const domainName = ref('')

  function loadTurtle(ttl: string) {
    upperRepository.loadTurtle(ttl)
    refresh()
  }

  function refresh() {
    const model = buildVueFlowModel(upperRepository)

    nodes.value = model.nodes
    edges.value = model.edges
    domainName.value = model.domainName
  }

  async function serialize(): Promise<string> {
    return await upperRepository.serializeTurtle()
  }

  return {
    nodes,
    edges,
    domainName,
    loadTurtle,
    refresh,
    serialize,
  }
})
