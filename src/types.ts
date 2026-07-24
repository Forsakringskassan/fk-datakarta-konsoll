declare module 'rdf-ext' {
  import type { DatasetCoreFactory } from '@rdfjs/types'

  const rdf: DatasetCoreFactory & {
    clone(): any
    formats: {
      import(formats: any): void
    }
    io: {
      dataset: {
        toText(mediaType: string, dataset: any): Promise<string>
      }
    }
  }

  export default rdf
}
