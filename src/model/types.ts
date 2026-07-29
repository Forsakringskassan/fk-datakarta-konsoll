export interface SchemaNodeProperty {
  name: string
  type: string
  description?: string
}

export interface SchemaNodeData {
  kind: 'schema'
  label: string
  description?: string
  properties: SchemaNodeProperty[]
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

export interface BaseProperty {
  id: string
  label: string
  description?: string
}

export interface Attribute extends BaseProperty {
  kind: 'attribute'
  datatype: string
  minCount?: number
  maxCount?: number
}

export interface Relationship extends BaseProperty {
  kind: 'relationship'
  targetClass: string
  minCount?: number
  maxCount?: number
}

export type Property = Attribute | Relationship

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
