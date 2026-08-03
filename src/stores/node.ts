import { defineStore } from 'pinia'
import type { ModelNodeData, State } from '@/model/types'

export const useNodeStore = defineStore('node', {
  state: (): State => {
    return {
      selectedNode: null,
      ttl: '',
    }
  },

  actions: {
    updateLabel(value: string) {
      const node = this.selectedNode

      if (node) {
        node.label = value
      }
    },
    updateDescription(value: string) {
      const node = this.selectedNode

      if (node) {
        node.description = value
      }
    },
    addAttribute(id: string) {
      const node = this.selectedNode

      if (node?.kind === 'schema') {
        node.properties.push({
          id: id,
          kind: 'attribute',
          label: 'Ny egenskap',
          minCount: 1,
          maxCount: 1,
          datatype: 'xsd:string',
        })
      }
    },
    removeAttribute(index: number) {
      const node = this.selectedNode

      if (node?.kind === 'schema') {
        node.properties.splice(index, 1)
      }
    },
    addEnumValue(id: string) {
      const node = this.selectedNode

      if (node?.kind === 'enumeration') {
        node.values.push({
          id: id,
          label: 'Nytt värde',
        })
      }
    },
    removeEnumValue(index: number) {
      const node = this.selectedNode

      if (node?.kind === 'enumeration') {
        node.values.splice(index, 1)
      }
    },
    updateEnumValue(index: number, value: string) {
      const node = this.selectedNode

      if (node?.kind === 'enumeration') {
        const enumVal = node.values[index]
        if (enumVal !== undefined) {
          enumVal.label = value
        }
      }
    },
  },
})
