export interface SchemaNodeProperty {
    name: string
      type: string
        description?: string
        }

        export interface SchemaNodeData {
          label: string
            properties: SchemaNodeProperty[]
              toolbarVisible?: boolean
              }
              
}