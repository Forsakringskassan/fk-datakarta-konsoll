<script setup lang="ts">
import { FLogo, FPageHeader, FPageLayout, FResizePane, registerLayout } from '@fkui/vue'
import { AppToolbar, SchemaDetails, AppContextBar } from '@/components'
import { useNodeStore } from '@/stores/node'

const nodeStore = useNodeStore()

declare module '@fkui/vue' {
  interface FPageLayoutSlotMapping {
    'app-layout': ['header', 'left', 'contextbar', 'toolbar', 'content', 'right', 'footer']
  }
}

function handleGlobalClick(event: MouseEvent) {
  const target = event.target as HTMLElement

  // Don't deselect when clicking a Vue Flow node.
  if (target.closest('.vue-flow__node')) {
    return
  }

  // Don't deselect when clicking the details pane.
  if (target.closest('.details-pane')) {
    return
  }

  nodeStore.selectNode('')
}

registerLayout({
  name: 'app-layout',
  areas: {
    header: {
      attachPanel: 'none',
      direction: 'column',
    },
    left: {
      attachPanel: 'left',
      direction: 'column',
    },
    contextbar: {
      attachPanel: 'none',
      direction: 'row',
    },
    toolbar: {
      attachPanel: 'none',
      direction: 'row',
    },
    content: {
      attachPanel: 'none',
      direction: 'column',
      scroll: true,
    },
    right: {
      attachPanel: 'right',
      direction: 'column',
    },
    footer: {
      attachPanel: 'none',
      direction: 'column',
    },
  },
})
</script>

<template>
  <f-page-layout layout="app-layout" @click="handleGlobalClick">
    <template #default="{ header, contextbar, toolbar, content, left, right }">
      <header :slot="header">
        <f-page-header>
          Datakartan
          <template #logo>
            <f-logo size="small">Logo</f-logo>
          </template>
          <template #right> Namn Namnsson </template>
        </f-page-header>
      </header>

      <app-context-bar :slot="contextbar"></app-context-bar>

      <main :slot="content" class="content">
        <router-view />
      </main>

      <app-toolbar :slot="toolbar"></app-toolbar>

      <f-resize-pane
        :slot="right"
        class="details-pane"
        min="200px 10%"
        max="40%"
        initial="200px"
        v-if="nodeStore.selectedNode"
      >
        <schema-details />
      </f-resize-pane>
    </template>
  </f-page-layout>
</template>

<style scoped>
::part(grid app-layout) {
  grid-template:
    'header header header' min-content
    'left contextbar contextbar' min-content
    'left toolbar toolbar' min-content
    'left content right' 1fr
    / min-content 1fr;
}

::part(area header) {
  --f-page-layout-background: var(--fkds-color-header-background-primary);
  --f-page-layout-color: var(--fkds-color-text-inverted);
}

::part(area contextbar) {
  --f-page-layout-background: var(--fkds-color-background-secondary);
  --f-page-layout-color: var(--fkds-color-text-primary);
}

::part(area toolbar) {
  --f-page-layout-background: var(--fkds-color-background-secondary);
  --f-page-layout-color: var(--fkds-color-text-primary);
}

::part(area left) {
  --f-page-layout-background: var(--fkds-color-background-secondary);
  --f-page-layout-color: var(--fkds-color-text-primary);
}

::part(area right) {
  --f-page-layout-background: var(--fkds-color-background-secondary);
  --f-page-layout-color: var(--fkds-color-text-primary);
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
