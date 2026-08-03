<script setup lang="ts">
import { computed } from 'vue'
import { FTextField, FSelectField, FButton } from '@fkui/vue'
import { useNodeStore } from '@/stores/node'
import type { SchemaNodeData, EnumerationNodeData } from '@/model/types'

const nodeStore = useNodeStore()

const fieldTypes = {
  string: 'xsd:string',
  integer: 'xsd:integer',
  boolean: 'xsd:boolean',
  dateTime: 'xsd:dateTime',
  long: 'xsd:long',
  double: 'xsd:double',
}

const schemaData = computed<SchemaNodeData | null>(() => {
  const node = nodeStore.selectedNode
  return node && node.data.kind === 'schema' ? node.data : null
})

const enumData = computed<EnumerationNodeData | null>(() => {
  const node = nodeStore.selectedNode
  return node && node.data.kind === 'enumeration' ? node.data : null
})

function addProperty() {
  schemaData.value?.properties.push({ label: 'new_property', datatype: 'xsd:string' })
}

function removeProperty(index: number) {
  schemaData.value?.properties.splice(index, 1)
}

function addValue() {
  enumData.value?.values.push({ id: `enum-value-${Date.now()}`, label: 'New value' })
}

function removeValue(index: number) {
  enumData.value?.values.splice(index, 1)
}
</script>

<template>
  <div class="schema-details">
    <template v-if="schemaData">
      <h3>Schema</h3>

      <f-text-field v-model="schemaData.label">Namn</f-text-field>
      <f-text-field v-model="schemaData.description" multiline>Beskrivning</f-text-field>

      <h4>Fält</h4>
      <div v-for="(property, index) in schemaData.properties" :key="index" class="property-row">
        <f-text-field v-model="property.label">Namn</f-text-field>
        <f-select-field v-model="property.datatype">
          <template #label>Typ</template>
          <option
            v-for="(value, key) in fieldTypes"
            :key="key"
            :value="value"
            @change="property.datatype = $event"
          >
            {{ key }}
          </option>
        </f-select-field>
        <f-text-field v-model="property.description">Beskrivning</f-text-field>
        <f-button variant="secondary" size="small" type="button" @click="removeProperty(index)">
          Ta bort
        </f-button>
      </div>

      <f-button variant="secondary" type="button" @click="addProperty"> Lägg till fält </f-button>
    </template>

    <template v-else-if="enumData">
      <h3>Enumeration</h3>

      <f-text-field v-model="enumData.label">Namn</f-text-field>
      <f-text-field v-model="enumData.description" multiline>Beskrivning</f-text-field>

      <h4>Värden</h4>
      <div v-for="(value, index) in enumData.values" :key="value.id" class="value-row">
        <f-text-field v-model="value.label">Värde</f-text-field>
        <f-button variant="secondary" size="small" type="button" @click="removeValue(index)">
          Ta bort
        </f-button>
      </div>

      <f-button variant="secondary" type="button" @click="addValue"> Lägg till värde </f-button>
    </template>

    <p v-else>Ingen nod vald.</p>
  </div>
</template>

<style scoped>
.schema-details {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.property-row,
.value-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}
</style>
