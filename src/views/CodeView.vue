<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as monaco from 'monaco-editor'
import { useNodeStore } from '@/stores/node'

const nodeStore = useNodeStore()

const editorContainer = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | undefined

onMounted(() => {
  if (!editorContainer.value) {
    return
  }

  editor = monaco.editor.create(editorContainer.value, {
    value: nodeStore.ttl,
    language: 'plaintext',
    theme: 'vs-light',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    fontSize: 14,
  })
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="editorContainer" class="editor"></div>
</template>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
}
</style>
