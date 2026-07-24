import { Store, DataFactory, Parser } from 'n3'
import type { Node, Edge } from '@vue-flow/core'
import type { SchemaNodeData } from './types'

const { namedNode } = DataFactory

interface ClassInfo {
  id: string
  label: string
}

interface PropertyInfo {
  id: string
  label: string
  kind: 'attribute' | 'relationship'
  datatype?: string
  targetClass?: string
}

export interface ParsedModel {
  domainName: string
  nodes: Node<SchemaNodeData>[]
  edges: Edge[]
}

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
// const UPPER_NAMESPACE = 'https://data.fk.se/upper#'
const UPPER_NAMESPACE = 'https://rdf.netflix.net/ns/upper#'
// const UPPER_DIRECT_CLASS = 'https://rdf.netflix.net/ns/upper#DirectClass'
const UPPER_DOMAIN = namedNode(`${UPPER_NAMESPACE}DomainModel`)
const UPPER_DIRECT_CLASS = namedNode(`${UPPER_NAMESPACE}DirectClass`)
const UPPER_ATTRIBUTE = namedNode(`${UPPER_NAMESPACE}Attribute`)
const UPPER_RELATIONSHIP = namedNode(`${UPPER_NAMESPACE}Relationship`)
// const UPPER_PROPERTY = namedNode('https://rdf.netflix.net/ns/upper#property')
const UPPER_PROPERTY = namedNode(`${UPPER_NAMESPACE}property`)
const UPPER_LABEL = namedNode(`${UPPER_NAMESPACE}label`)
const UPPER_DESCRIPTION = namedNode(`${UPPER_NAMESPACE}description`)
const UPPER_DATATYPE = namedNode(`${UPPER_NAMESPACE}datatype`)
const UPPER_MIN_COUNT = namedNode(`${UPPER_NAMESPACE}minCount`)
const UPPER_MAX_COUNT = namedNode(`${UPPER_NAMESPACE}maxCount`)
const UPPER_KEYED_ON = namedNode(`${UPPER_NAMESPACE}keyedOn`)

export function parseModel(ttl: string): ParsedModel {
  const nodes: Node<SchemaNodeData>[] = []
  const edges: Edge[] = []

  const parser = new Parser()
  const store = new Store(parser.parse(ttl))

  let domainName = ''

  // Find domain name
  const domainModels = store.getSubjects(
    namedNode(RDF_TYPE),
    namedNode(`${UPPER_NAMESPACE}DomainModel`),
    null,
  )

  const domainModel = domainModels[0]

  if (domainModel) {
    const domain = store.getObjects(domainModel, UPPER_DOMAIN, null)[0]

    domainName = domain?.value ?? ''
  }

  // Find classes
  const directClasses = store.getSubjects(namedNode(RDF_TYPE), UPPER_DIRECT_CLASS, null)

  for (const directClass of directClasses) {
    const classLabel =
      store.getObjects(directClass, UPPER_LABEL, null)[0]?.value ??
      directClass.value.split('#').pop()!

    const properties: SchemaNodeData['properties'] = []

    const classProperties = store.getObjects(directClass, UPPER_PROPERTY, null)

    for (const property of classProperties) {
      const type = store.getObjects(property, namedNode(RDF_TYPE), null)[0]

      const label =
        store.getObjects(property, UPPER_LABEL, null)[0]?.value ?? property.value.split('#').pop()!

      const description = store.getObjects(property, UPPER_DESCRIPTION, null)[0]?.value

      if (type?.equals(UPPER_ATTRIBUTE)) {
        const datatype = store.getObjects(property, UPPER_DATATYPE, null)[0]?.value

        properties.push({
          name: label,
          type: datatype?.split('#').pop() ?? 'string',
          description,
        })
      }

      if (type?.equals(UPPER_RELATIONSHIP)) {
        const target = store.getObjects(property, namedNode(`${UPPER_NAMESPACE}class`), null)[0]
          ?.value

        if (target) {
          edges.push({
            id: `${directClass.value}-${target}`,
            type: 'smoothstep',
            source: directClass.value,
            target,
            label,
          })
        }

        properties.push({
          name: label,
          type: target?.split('#').pop() ?? 'unknown',
          description,
        })
      }
    }

    nodes.push({
      id: directClass.value,
      type: 'schema-node',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        label: classLabel,
        properties,
      },
    })
  }

  return {
    domainName,
    nodes,
    edges,
  }
}
