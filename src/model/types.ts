export interface SchemaNodeData {
  kind: 'schema'
  label: string
  description?: string
  properties: Property[]
  toolbarVisible?: boolean
}

export interface EnumerationNodeData {
  kind: 'enumeration'
  label: string
  description?: string
  values: EnumValue[]
  toolbarVisible?: boolean
}

export type ModelNodeData = SchemaNodeData | EnumerationNodeData

export interface DirectClass {
  id: string
  label: string
  description?: string
  properties: Property[]
}

export interface Enumeration {
  id: string
  label: string
  description?: string
  values: EnumValue[]
}

export interface EnumValue {
  id: string
  label: string
}

export interface BaseProperty {
  id: string
  label: string
  description?: string
  minCount?: number
  maxCount?: number
}

export interface Attribute extends BaseProperty {
  kind: 'attribute'
  datatype: string
}

export interface Relationship extends BaseProperty {
  kind: 'relationship'
  targetClass: string
}

export type Property = Attribute | Relationship
