import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import PokemonDetail from '@/views/PokemonDetail.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/pokemon/:id', name: 'pokemon', component: PokemonDetail, props: true },
]

const router = createRouter({
  history: createWebHashHistory(), 
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
