import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InstitutionsView from '../views/InstitutionsView.vue'
import DepartmentsView from '../views/DepartmentsView.vue'
import PeoplesView from '../views/PeoplesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/institutions',
    name: 'institutions',
    component: InstitutionsView
  },
  {
    path: '/departments',
    name: 'departments',
    component: DepartmentsView
  },
  {
    path: '/peoples',
    name: 'peoples',
    component: PeoplesView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router