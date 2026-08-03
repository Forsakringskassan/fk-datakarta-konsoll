// stores/model.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNodeStore } from '@/stores/node'
import { upperRepository } from '@/model/upperRepository'

// Pinia store for interaction with RDF and TURTLE files.
export const useModelStore = defineStore('model', () => {
  const ttl = ref('')
  const error = ref<string | null>(null)

  function loadTurtle(value: string) {
    ttl.value = value

    try {
      upperRepository.loadTurtle(value)
    } catch (e) {
      error.value = String(e)
    }
  }

  function updateTtl(value: string) {
    ttl.value = value

    try {
      upperRepository.loadTurtle(value)
      error.value = null

      const nodeStore = useNodeStore()
      nodeStore.rebuildFromRdf()
    } catch (e) {
      error.value = String(e)
    }
  }

  async function serialize(): Promise<string> {
    return upperRepository.serializeTurtle()
  }

  return {
    ttl,
    error,
    loadTurtle,
    serialize,
    updateTtl,
  }
})
