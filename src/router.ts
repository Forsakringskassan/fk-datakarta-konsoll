import { createRouter, createWebHashHistory } from 'vue-router'
import { GraphView, HomeView } from './views'
import CodeView from './views/CodeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'app-home', component: HomeView },
    { path: '/graph-view', name: 'graph-view', component: GraphView },
    { path: '/code-view', name: 'code-view', component: CodeView },
  ],
})

export default router
