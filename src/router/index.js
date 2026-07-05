import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'StudentHome',
    component: () => import('../views/StudentHome.vue')
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/admin',
    component: () => import('../components/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/AdminDashboard.vue')
      },
      {
        path: 'requests',
        name: 'AdminRequests',
        component: () => import('../views/AdminRequests.vue')
      },
      {
        path: 'books',
        name: 'AdminBooks',
        component: () => import('../views/AdminBooks.vue')
      }
    ]
  },
  {
    path: '/student',
    component: () => import('../components/StudentLayout.vue'),
    children: [
      {
        path: '', 
        name: 'StudentCatalog',
        component: () => import('../views/StudentCatalog.vue')
      },
      {
        path: 'book/:id',
        name: 'StudentBookDetail',
        component: () => import('../views/StudentBookDetail.vue')
      },
      {
        path: 'history',
        name: 'StudentHistory',
        component: () => import('../views/StudentHistory.vue')
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: () => import('../views/StudentProfile.vue')
      }
    ]
  },
  {
    path: '/student/setup-profile',
    name: 'StudentSetupProfile',
    component: () => import('../views/StudentSetupProfile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
