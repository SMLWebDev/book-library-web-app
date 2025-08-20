<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex-items-center">
          <RouterLink to="/" class="text-xl font-bold text-primary-700">
            My Library
          </RouterLink>
        </div>

        <div class="flex space-x-4">
          <RouterLink to="/" class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md">
            Search
          </RouterLink>
          <RouterLink to="/library" class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md">
            My Library
          </RouterLink>
          <RouterLink to="/to-read" class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md">
            To Read
          </RouterLink>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useBookStore } from '@/stores/books';

const bookStore = useBookStore()

onMounted(() => {
  bookStore.fetchUserBooks()
})
</script>

<style scoped></style>
