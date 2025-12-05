import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/AdministratorStart.vue'
import AdministratorStart from '../views/AdministratorStart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AdministratorStart',
      component: AdministratorStart
    },
    {
      path:'/login/',
      name: 'loginView',
      component: () => import ('../views/loginView.vue')
      path: '/homepage/',
      name: 'HomePage',
      component: () => import('../views/HomePage.vue')
    },
      {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/lobby/:id',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    }
  ]
})

export default router
