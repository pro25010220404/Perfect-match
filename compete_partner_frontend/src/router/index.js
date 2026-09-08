import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: '/teams',
        name: 'Teams',
        component: () => import('../views/TeamsView.vue')
      },
      {
        path: '/teams/:id',
        name: 'TeamDetail',
        component: () => import('../views/TeamDetailView.vue')
      },
      {
        path: '/create-team',
        name: 'CreateTeam',
        component: () => import('../views/CreateTeamView.vue')
      },
      {
        path: '/recommendations',
        name: 'Recommendations',
        component: () => import('../views/RecommendationsView.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue')
      },
      {
        path: '/invitations',
        name: 'Invitations',
        component: () => import('../views/InvitationsView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginEntryView.vue'),
    meta: { guest: true }
  },
  {
    path: '/signup',
    redirect: { name: 'Login', query: { tab: 'register' } }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else if (to.meta.guest && userStore.isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
