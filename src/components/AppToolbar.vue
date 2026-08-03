<script setup lang="ts">
import { type NavigationMenuItem, FNavigationMenu } from '@fkui/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const bar1: NavigationMenuItem[] = [
  { label: 'Hem', route: 'app-home' },
  { label: 'Graf', route: 'graph-view' },
  { label: 'Kod', route: 'code-view' },
]

function onSelectRoute(route: string): void {
  router.push({ name: route })
}
</script>

<template>
  <div class="toolbar">
    <f-navigation-menu
      aria-label="Primary toolbar"
      :routes="bar1"
      @selected-route="onSelectRoute"
    ></f-navigation-menu>
  </div>
</template>

<style>
.toolbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
