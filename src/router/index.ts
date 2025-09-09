import { createRouter, createWebHistory } from 'vue-router'

import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/genres',
      name: 'genres',
      component: () => import('../views/GenresView.vue')
    },
    {
      path: '/genres/:id',
      name: 'filmsByGenres',
      props: true,
      component: () => import('../views/FilmsByGenresView.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/films/:id',
      name: 'films',
      // props: route => ({ id: route.params.id }),
      props: true,
      component: () => import('../views/FilmView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView // Этот компонент должен всегда загружаться статически!     () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
