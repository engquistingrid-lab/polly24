import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    
    },


    ///{
    ///  path: '/homepage/',
   ///  name: 'HomePage',
    ///  component: () => import('../views/HomePage.vue')
    ///}
    

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
      path:'/StartNewGroup/',
      name: 'StartNewGroup',
      component: () => import ('../views/StartNewGroup.vue')},

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
    path: '/administratorgrouppage/:groupCode',
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
