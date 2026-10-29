import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/album',
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('../views/AlbumView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/album',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
