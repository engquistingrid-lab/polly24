import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import StartView1 from '../views/StartView1.vue'
import AdministratorGroupPage from '../views/AdministratorGroupPage.vue'
import GroupPage from '../views/GroupPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'StartView1',
      component: StartView1
    },
    {
      path:'/login/',
      name: 'loginView',
      component: () => import ('../views/loginView.vue')},

      {
      path:'/signup/',
      name: 'Signupview',
      component: () => import ('../views/SignupView.vue')},

      {path: '/homepage/',
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
