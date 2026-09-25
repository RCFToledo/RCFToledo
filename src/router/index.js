import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth } from '@/middleware/AuthGuard'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/Unauthorized.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if (to.path.startsWith('/silent-check-sso.html')) {
    return false
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    return requireAuth(to)
  }
  return true
})

export default router