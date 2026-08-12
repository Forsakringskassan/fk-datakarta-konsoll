// stores/model.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNodeStore } from '@/stores/node'
import { upperRepository } from '@/model/upperRepository'

// Pinia store for interaction with RDF and TURTLE files.
export const useModelStore = defineStore('model', () => {
  const ttl = ref('')
  const error = ref<string | null>(null)

  function refresh() {
    const nodeStore = useNodeStore()

    ttl.value = upperRepository.serializeTurtle()
    nodeStore.rebuildFromRdf()
  }

  function loadTurtle(value: string) {
    ttl.value = value

    try {
      upperRepository.loadTurtle(value)
      refresh()
    } catch (e) {
      error.value = String(e)
    }
  }

  function updateTtl(value: string) {
    try {
      upperRepository.loadTurtle(value)
      error.value = null
      ttl.value = value

      const nodeStore = useNodeStore()
      nodeStore.rebuildFromRdf()
    } catch (e) {
      error.value = String(e)
      console.error(error.value)
    }
  }

  async function serialize(): Promise<string> {
    return upperRepository.serializeTurtle()
  }

  function updateLabel(id: string, value: string) {
    upperRepository.updateLabel(id, value)
    refresh()
  }

  function updateDescription(id: string, value: string) {
    upperRepository.updateDescription(id, value)
    refresh()
  }

  function updateDatatype(id: string, value: string) {
    upperRepository.updateDatatype(id, value)
    refresh()
  }

  function addAttribute(classId: string, propId: string) {
    upperRepository.addAttribute(classId, {
      id: propId,
      label: 'Ny egenskap',
      datatype: 'xsd:string',
    })
    refresh()
  }

  function removeAttribute(classId: string, propId: string) {
    upperRepository.removeAttribute(classId, propId)
    refresh()
  }

  function addRelationship(sourceId: string, targetId: string, label: string) {
    upperRepository.addRelationship(sourceId, targetId, label)
    refresh()
  }

  function removeRelationship(id: string) {
    upperRepository.removeRelationship(id)
    refresh()
  }

  function addSchema(id: string, label: string) {
    upperRepository.addSchema(id, label)
    refresh()
  }

  function removeSchema(id: string) {
    upperRepository.removeSchema(id)
    refresh()
  }

  return {
    ttl,
    error,
    loadTurtle,
    serialize,
    updateTtl,
    updateLabel,
    updateDescription,
    updateDatatype,
    addAttribute,
    removeAttribute,
    addRelationship,
    removeRelationship,
    addSchema,
    removeSchema,
  }
})
