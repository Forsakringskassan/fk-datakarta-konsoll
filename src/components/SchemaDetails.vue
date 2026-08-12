<script setup lang="ts">
import { computed } from 'vue'
import { FTextField, FSelectField, FButton } from '@fkui/vue'
import { useNodeStore } from '@/stores/node'
import { useModelStore } from '@/stores/model'
import type {
  SchemaNodeData,
  EnumerationNodeData,
  Attribute,
  EnumValue,
  Property,
} from '@/model/types'

const nodeStore = useNodeStore()
const modelStore = useModelStore()

const fieldTypes = {
  string: 'xsd:string',
  integer: 'xsd:integer',
  boolean: 'xsd:boolean',
  dateTime: 'xsd:dateTime',
  long: 'xsd:long',
  double: 'xsd:double',
}

const selectedNode = computed(() => {
  return nodeStore.selectedNode
})

function addAttribute(selectedNode: SchemaNodeData) {
  if (selectedNode) {
    modelStore.addAttribute(selectedNode.id, `attribute-${Date.now()}`)
  }
}

function removeAttribute(selectedNode: SchemaNodeData, attribute: Attribute) {
  if (selectedNode) {
    modelStore.removeAttribute(selectedNode.id, attribute.id)
  }
}

function updateLabel(entrityId: string, value: string) {
  modelStore.updateLabel(entrityId, value)
}

function updateDatatype(property: Attribute, datatype: string) {
  modelStore.updateDatatype(property.id, datatype)
}

function updateDescription(entityId: string, value: string) {
  modelStore.updateDescription(entityId, value)
}
</script>

<template>
  <div class="schema-details">
    <template v-if="selectedNode !== null && selectedNode.kind === 'schema'">
      <h3>Schema</h3>

      <f-text-field
        v-model="selectedNode.label"
        @blur="updateLabel(selectedNode.id, selectedNode.label)"
        @keydown.enter="updateLabel(selectedNode.id, selectedNode.label)"
        >Namn</f-text-field
      >
      <f-text-field
        v-model="selectedNode.description"
        multiline
        @blur="updateDescription(selectedNode.id, selectedNode.description)"
        @keydown.enter="updateDescription(selectedNode.id, selectedNode.description)"
        >Beskrivning</f-text-field
      >

      <h4>Fält</h4>
      <div v-for="(property, index) in selectedNode.properties" :key="index" class="property-row">
        <f-text-field
          v-model="property.label"
          @blur="updatePropertyLabel(property)"
          @keydown.enter="updatePropertyLabel(property)"
          >Namn</f-text-field
        >
        <f-select-field v-if="property.kind === 'attribute'">
          <template #label>Typ</template>
          <option
            v-for="(value, key) in fieldTypes"
            :key="key"
            :value="value"
            @change="updateDatatype(property, value)"
          >
            {{ key }}
          </option>
        </f-select-field>
        <f-text-field v-model="property.description">Beskrivning</f-text-field>
        <f-button variant="secondary" size="small" type="button" @click="removeAttribute(property)">
          Ta bort
        </f-button>
      </div>

      <f-button variant="secondary" size="small" type="button" @click="addAttribute(selectedNode)">
        Lägg till fält
      </f-button>
    </template>

    <template v-else-if="selectedNode !== null && selectedNode.kind === 'enumeration'">
      <h3>Enumeration</h3>

      <f-text-field v-model="selectedNode.label">Namn</f-text-field>
      <f-text-field v-model="selectedNode.description" multiline>Beskrivning</f-text-field>

      <h4>Värden</h4>
      <div v-for="(value, index) in selectedNode.values" :key="value.id" class="value-row">
        <f-text-field v-model="value.label">Värde</f-text-field>
        <f-button variant="secondary" size="small" type="button" @click="removeValue(index)">
          Ta bort
        </f-button>
      </div>

      <f-button variant="secondary" type="button" @click="addValue"> Lägg till värde </f-button>
    </template>

    <template v-else>
      <p>Ingen nod vald.</p>
    </template>
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
