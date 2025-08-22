import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LibraryView from '@/views/LibraryView.vue'
import ToReadView from '@/views/ToReadView.vue'
import BookDetailView from '@/views/BookDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/library',
      name: 'library',
      component: LibraryView
    },
    {
      path: '/to-read',
      name: 'to-read',
      component: ToReadView
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: BookDetailView,
      props: true
    }
  ],
})

export default router
