<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as monaco from 'monaco-editor'
import { useModelStore } from '@/stores/model'

const modelStore = useModelStore()

const editorContainer = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | undefined
let changeDisposable: monaco.IDisposable | undefined
let timer: ReturnType<typeof setTimeout>

onMounted(() => {
  if (!editorContainer.value) {
    return
  }

  editor = monaco.editor.create(editorContainer.value, {
    value: modelStore.ttl,
    language: 'plaintext',
    theme: 'vs-light',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    fontSize: 14,
  })

  changeDisposable = editor.onDidChangeModelContent(() => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      modelStore.updateTtl(editor!.getValue())
    }, 300)
  })
})

onBeforeUnmount(() => {
  changeDisposable?.dispose()
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
