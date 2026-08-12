import type { Node, Edge } from '@vue-flow/core'

import type { Attribute, EnumerationNodeData, Relationship, SchemaNodeData } from '@/model/types'
import type { ParsedModel } from '@/model/parser'
import { UpperRepository } from '@/model/upperRepository'

export function buildVueFlowModel(repository: UpperRepository): ParsedModel {
  const nodes: Node<SchemaNodeData | EnumerationNodeData>[] = []
  const edges: Edge[] = []

  for (const cls of repository.getDirectClasses()) {
    const attributes: Attribute[] = []

    for (const property of cls.properties) {
      if (property.kind === 'relationship') {
        edges.push({
          id: property.id,
          source: cls.id,
          target: property.targetClass,
          label: property.label,
        })
      }
      if (property.kind === 'attribute') {
        attributes.push({
          id: property.id,
          label: property.label,
          datatype: property.datatype,
          description: property.description ?? '',
          kind: property.kind,
        })
      }
    }

    nodes.push({
      id: cls.id,
      type: 'schema-node',
      position: { x: 0, y: 0 },
      data: {
        id: cls.id,
        kind: 'schema',
        label: cls.label,
        description: cls.description ?? '',
        properties: attributes,
      },
    })
  }

  for (const enumeration of repository.getEnumerations()) {
    nodes.push({
      id: enumeration.id,
      type: 'enumeration-node',
      position: { x: 0, y: 0 },
      data: {
        kind: 'enumeration',
        label: enumeration.label,
        description: enumeration.description,
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
