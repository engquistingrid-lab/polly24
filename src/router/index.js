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
     {
      path:'/joingroup/',
      name: 'JoinGroup',
      component: () => import ('../views/JoinGroup.vue')},

    {
      path: '/yourassignedpage/:groupCode',
      name: 'YourAssignedPage',
      component: () => import('../views/YourAssignedPage.vue')
    },
      {
      path:'/StartNewGroup/',
      name: 'StartNewGroup',
      component: () => import ('../views/StartNewGroup.vue')
    },
    {
    path: '/wishlist/',
    name: 'WishlistGame',
    component: () => import('../views/WishlistGame.vue')
  },
  {
    path: '/grouppage/:groupCode',
    name: 'GroupPage',
    component: () => import('../views/GroupPage.vue')
  },
 
  ]
})

export default router
