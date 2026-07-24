import type { Node, Edge } from '@vue-flow/core'

import type { SchemaNodeData } from '@/model/types'
import type { ParsedModel } from '@/model/parser'
import { UpperRepository } from '@/model/upperRepository'

export function buildVueFlowModel(repository: UpperRepository): ParsedModel {
  const nodes: Node<SchemaNodeData>[] = []
  const edges: Edge[] = []

  for (const cls of repository.getDirectClasses()) {
    nodes.push({
      id: cls.id,
      type: 'schema-node',
      position: { x: 0, y: 0 },
      data: {
        label: cls.label,
        properties: cls.properties.map((property) => ({
          name: property.label,
          type:
            property.kind === 'attribute'
              ? (property.datatype.split('#').pop() ?? 'string')
              : (property.targetClass.split('#').pop() ?? 'unknown'),
          description: property.description,
        })),
      },
    })

    for (const property of cls.properties) {
      if (property.kind === 'relationship') {
        edges.push({
          id: `${cls.id}-${property.targetClass}`,
          source: cls.id,
          target: property.targetClass,
          type: 'smoothstep',
          label: property.label,
        })
      }
    }
  }

  for (const enumeration of repository.getEnumerations()) {
    nodes.push({
      id: enumeration.id,
      type: 'enumeration-node',
      position: { x: 0, y: 0 },
      data: {
        label: enumeration.label,
        values: enumeration.values,
      },
    })
  }
  const nodeIds = new Set(nodes.map((node) => node.id))
  const validEdges = edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))

  return {
    domainName: repository.getDomainName(),
    nodes,
    edges: validEdges,
  }
}
