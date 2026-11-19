import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RodrigoView from '../views/RodrigoView.vue'
import BiomasView from '../views/BiomasView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/rodrigo',
    name: 'rodrigo',
    component: RodrigoView
  },
  {
    path: '/biomas',
    name: 'biomas',
    component: BiomasView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router