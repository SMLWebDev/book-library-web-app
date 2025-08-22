<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 w-full">
          
          <div class="flex w-full justify-between items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <div class="flex">
                <RouterLink 
                  to="/" 
                  class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  Search
                </RouterLink>
                <RouterLink 
                  to="/library" 
                  class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  My Library
                </RouterLink>
                <RouterLink 
                  to="/to-read" 
                  class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  To Read
                </RouterLink>
              </div>
              <div class="flex">
                <UserMenu />
              </div>
            </template>
            
            <template v-else>
              <Button
                @click="showAuthModal = true"
                class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
              >
                Sign In
              </Button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="!authStore.initialized" class="text-center py-8">
        <div class="text-gray-500">Loading...</div>
      </div>
      
      <div v-else-if="!authStore.isAuthenticated" class="text-center py-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Personal Library
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto mb-8">
          Track your reading journey. Search for books, organize your library, 
          and keep track of what you want to read next.
        </p>
        <Button
          @click="showAuthModal = true"
          class="bg-primary-500 text-white px-8 py-3 rounded-md hover:bg-primary-600 text-lg"
        >
          Get Started
        </Button>
      </div>
      
      <RouterView v-else />
    </main>

    <AuthModal 
      :show-modal="showAuthModal" 
      @close="showAuthModal = false"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
// import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { useBookStore } from '@/stores/books'

import AuthModal from '@/components/AuthModal.vue'
import UserMenu from '@/components/UserMenu.vue'

import { Button } from 'primevue'

const authStore = useAuthStore()
const bookStore = useBookStore()
const showAuthModal = ref(false)

async function handleAuthSuccess() {
  showAuthModal.value = false
  // Fetch user's books after successful authentication
  await bookStore.fetchUserBooks()
}

onMounted(async () => {
  // Initialize auth state
  await authStore.initialize()
  
  // If user is authenticated, fetch their books
  if (authStore.isAuthenticated) {
    await bookStore.fetchUserBooks()
  }
})
</script>