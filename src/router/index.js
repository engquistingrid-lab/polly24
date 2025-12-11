import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import StartView1 from '../views/StartView1.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'startView1',
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
      path:'/joingroup/',
      name: 'JoinGroup',
      component: () => import ('../views/JoinGroup.vue')},

    {
      path: '/yourassignedpage/',
      name: 'YourAssignedPage',
      component: () => import('../views/YourAssignedPage.vue')
    },
      {
      path:'/administratorstart/',
      name: 'AdministratorStart',
      component: () => import ('../views/AdministratorStart.vue')},
    {
      path: '/mygroupspage/',
      name: 'MyGroupsPage',
      component: () => import('../views/MyGroupsPage.vue')
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
    },
    {
    path: '/wishlist/',
    name: 'WishlistGame',
    component: () => import('../views/WishlistGame.vue')
  },
  {
    path: '/wishlistAdmin/',
    name: 'WishlistGameAdmin',
    component: () => import('../views/WishlistGameAdmin.vue')
  },
  {
    path: '/administratorgrouppage/',
    name: 'AdministratorGroupPage',
    component: () => import('../views/AdministratorGroupPage.vue')
  },
  { 
    path: '/participantgrouppage/',
    name: 'ParticipantGroupPage',
    component: () => import('../views/ParticipantGroupPage.vue')
  },
  ]
})

export default router
