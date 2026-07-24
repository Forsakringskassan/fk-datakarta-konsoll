import { Store, Parser, DataFactory, NamedNode } from 'n3'
import type { Term } from 'n3'
import type { DirectClass, Attribute, Relationship, Enumeration, EnumValue } from './types'

const { namedNode } = DataFactory

const RDF_TYPE = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
const RDF_FIRST = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first')
const RDF_REST = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#rest')
const RDF_NIL = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil')
const UPPER_NAMESPACE = 'https://data.fk.se/upper#'
// const UPPER_NAMESPACE = 'https://rdf.netflix.net/ns/upper#'
const UPPER_DOMAIN = namedNode(`${UPPER_NAMESPACE}DomainModel`)
const UPPER_DIRECT_CLASS = namedNode(`${UPPER_NAMESPACE}DirectClass`)
const UPPER_ATTRIBUTE = namedNode(`${UPPER_NAMESPACE}Attribute`)
const UPPER_RELATIONSHIP = namedNode(`${UPPER_NAMESPACE}Relationship`)
const UPPER_PROPERTY = namedNode(`${UPPER_NAMESPACE}property`)
const UPPER_LABEL = namedNode(`${UPPER_NAMESPACE}label`)
const UPPER_DESCRIPTION = namedNode(`${UPPER_NAMESPACE}description`)
const UPPER_DATATYPE = namedNode(`${UPPER_NAMESPACE}datatype`)
const UPPER_MIN_COUNT = namedNode(`${UPPER_NAMESPACE}minCount`)
const UPPER_MAX_COUNT = namedNode(`${UPPER_NAMESPACE}maxCount`)
const UPPER_KEYED_ON = namedNode(`${UPPER_NAMESPACE}keyedOn`)
const UPPER_ENUMERATION = namedNode(`${UPPER_NAMESPACE}Enumeration`)
const UPPER_ENUM_VALUE = namedNode(`${UPPER_NAMESPACE}EnumValue`)
const UPPER_ONE_OF = namedNode(`${UPPER_NAMESPACE}oneOf`)
const UPPER_CLASS = namedNode(`${UPPER_NAMESPACE}class`)

export class UpperRepository {
  private store = new Store()

  loadTurtle(ttl: string) {
    this.store = new Store()

    const parser = new Parser()
    this.store.addQuads(parser.parse(ttl))
  }

  async serializeTurtle(): Promise<string> {
    return this.serialize()
  }

  private serialize(): string {
    const lines: string[] = []

    this.writePrefixes(lines)
    this.writeDomain(lines)
    this.writeClasses(lines)
    this.writeProperties(lines)
    this.writeEnumerations(lines)

    return lines.join('\n')
  }

  private writePrefixes(lines: string[]) {
    lines.push(`# core domain models`)
    lines.push(`@prefix upper: <${UPPER_NAMESPACE}> .`)
    lines.push(
      `@prefix ${this.getDomainName()}: <https://data.fk.se/onto/${this.getDomainName()}#> .`,
    )
    lines.push(`@prefix mwi: <https://rdf.netflix.net/ns/mwi#> .`)
    lines.push(`@prefix owl: <http://www.w3.org/2002/07/owl#> .`)
    lines.push(`@prefix uda: <https://rdf.netflix.net/ns/uda#> .`)
    lines.push(`@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .`)
    lines.push(`@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .`)
    lines.push(``)
  }

  private writeDomain(lines: string[]) {
    const domain = this.getDomainName()

    lines.push(`${domain}:`)
    lines.push(`    a upper:DomainModel ;`)
    lines.push(`    upper:domain "${this.escape(domain)}" ;`)
    lines.push(`    owl:imports uda: ;`)
    lines.push(`.`)
    lines.push(``)
  }

  private writeClasses(lines: string[]) {
    for (const cls of this.getDirectClasses()) {
      lines.push(`${this.getDomainName()}:${this.localName(cls.id)}`)
      lines.push(`    a upper:DirectClass ;`)

      // TODO: Fixa in :keyedOn
      // lines.push(`    upper:keyedOn ( ${this.getDomainName()}:${this.localName(cls.id)} ) ;`)

      for (const property of cls.properties) {
        lines.push(`    upper:property ${this.getDomainName()}:${this.localName(property.id)} ;`)
      }

      lines.push(`    upper:label "${this.escape(cls.label)}"@en ;`)

      if (cls.description) {
        lines.push(`    upper:description "${this.escape(cls.description)}"@en ;`)
      }

      lines.push(`.`)
      lines.push(``)
    }
  }

  private writeProperties(lines: string[]) {
    const written = new Set<string>()

    for (const cls of this.getDirectClasses()) {
      for (const property of cls.properties) {
        if (written.has(property.id)) {
          continue
        }

        written.add(property.id)

        lines.push(`${this.getDomainName()}:${this.localName(property.id)}`)

        if (property.kind === 'attribute') {
          lines.push(`    a upper:Attribute ;`)
          lines.push(`    upper:datatype xsd:${this.localName(property.datatype)} ;`)
        }

        if (property.kind === 'relationship') {
          lines.push(`    a upper:Relationship ;`)
          lines.push(
            `    upper:class ${this.getDomainName()}:${this.localName(property.targetClass)} ;`,
          )
        }

        lines.push(`    upper:label "${this.escape(property.label)}"@en ;`)

        if (property.description) {
          lines.push(`    upper:description "${this.escape(property.description)}"@en ;`)
        }

        lines.push(`.`)
        lines.push(``)
      }
    }
  }

  private writeEnumerations(lines: string[]) {
    for (const enumeration of this.getEnumerations()) {
      lines.push(`${this.getDomainName()}:${this.localName(enumeration.id)}`)
      lines.push(`    a upper:Enumeration ;`)

      lines.push(`    upper:oneOf (`)

      for (const value of enumeration.values) {
        lines.push(`        ${this.getDomainName()}:${this.localName(value.id)}`)
      }

      lines.push(`    ) ;`)
      lines.push(`    upper:label "${this.escape(enumeration.label)}"@en ;`)

      if (enumeration.description) {
        lines.push(`    upper:description "${this.escape(enumeration.description)}"@en ;`)
      }

      lines.push(`.`)
      lines.push(``)
    }
  }

  private localName(uri: string): string {
    return uri.substring(uri.lastIndexOf('#') + 1)
  }

  private escape(value: string): string {
    return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
  }

  private getObject(subject: Term, predicate: NamedNode) {
    return this.store.getObjects(subject, predicate, null)[0]
  }

  private getLabel(subject: string): string {
    return (
      this.getObject(namedNode(subject), UPPER_LABEL)?.value ?? subject.split('#').pop() ?? subject
    )
  }

  private getDescription(subject: string): string | undefined {
    return this.getObject(namedNode(subject), UPPER_DESCRIPTION)?.value
  }

  getDirectClasses(): DirectClass[] {
    const subjects = this.store.getSubjects(RDF_TYPE, UPPER_DIRECT_CLASS, null)

    return subjects.map((subject) => ({
      id: subject.value,
      label: this.getLabel(subject.value),
      description: this.getDescription(subject.value),
      properties: this.getProperties(subject.value),
    }))
  }

  getProperties(classId: string): Array<Attribute | Relationship> {
    const properties = this.store.getObjects(namedNode(classId), UPPER_PROPERTY, null)

    return properties.map((property) => this.getProperty(property.value))
  }

  private getProperty(id: string): Attribute | Relationship {
    const subject = namedNode(id)

    const type = this.getObject(subject, RDF_TYPE)

    if (type?.equals(UPPER_ATTRIBUTE)) {
      return {
        id,
        label: this.getLabel(id),
        description: this.getDescription(id),
        kind: 'attribute',
        datatype: this.getObject(subject, UPPER_DATATYPE)?.value ?? 'string',
      } satisfies Attribute
    }

    if (type?.equals(UPPER_RELATIONSHIP)) {
      const target = this.getObject(subject, UPPER_CLASS)

      if (!target) {
        throw new Error(`Relationship ${id} has no upper:class`)
      }

      return {
        id,
        label: this.getLabel(id),
        description: this.getDescription(id),
        kind: 'relationship',
        targetClass: target.value,
      } satisfies Relationship
    }

    throw new Error(`Unknown property type: ${id}`)
  }

  getEnumerations(): Enumeration[] {
    const subjects = this.store.getSubjects(RDF_TYPE, UPPER_ENUMERATION, null)

    return subjects.map((subject) => ({
      id: subject.value,
      label: this.getLabel(subject.value),
      description: this.getDescription(subject.value),
      values: this.getEnumValues(subject),
    }))
  }

  private getEnumValues(subject: Term): EnumValue[] {
    const list = this.getObject(subject, UPPER_ONE_OF)

    if (!list) {
      return []
    }

    const values: EnumValue[] = []

    let current: Term | undefined = list

    while (current && !current.equals(RDF_NIL)) {
      const first = this.getObject(current, RDF_FIRST)

      if (first) {
        values.push({
          id: first.value,
          label: this.getLabel(first.value),
        })
      }

      current = this.getObject(current, RDF_REST)
    }

    return values
  }

  getDomainName(): string {
    const domainModel = this.store.getSubjects(RDF_TYPE, UPPER_DOMAIN, null)[0]

    if (!domainModel) {
      return ''
    }

    return this.getObject(domainModel, namedNode(`${UPPER_NAMESPACE}domain`))?.value ?? ''
  }
}

export const upperRepository = new UpperRepository()
