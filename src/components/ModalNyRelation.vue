<script setup lang="ts">
import { FFormModal, FTextField } from '@fkui/vue'

interface SchemaForm {
  label: string
  description: string
  minCount: number
  maxCount: number
}

// FKUI docs (2026-07-21): "Data muteras direkt på value-propen."
defineProps<{
  value: SchemaForm
}>()
</script>

<template>
  <FFormModal :value="value">
    <template #header> Nytt dataobjekt </template>

    <template #input-text-fields>
      <FTextField v-model="value.label"> Namn </FTextField>
    </template>
  </FFormModal>
</template>
