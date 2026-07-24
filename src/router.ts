import { createRouter, createWebHashHistory } from 'vue-router'
import { GraphView, HomeView } from './views'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'app-home', component: HomeView },
    { path: '/graph-view', name: 'graph-view', component: GraphView },
  ],
})

export default router
