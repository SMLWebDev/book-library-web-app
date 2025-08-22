<template>
  <div class="relative" ref="menuRef">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
    >
      <span class="text-sm"><Avatar :label=userInitial shape="circle" class="mr-2" /> {{ userEmail }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <div
      v-if="showMenu"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
    >
      <div class="py-1">
        <div class="px-4 py-2 text-sm text-gray-500 border-b">
          {{ userEmail }}
        </div>
        <button
          @click="handleSignOut"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

import { Avatar } from 'primevue'

const authStore = useAuthStore()
const showMenu = ref(false)
const menuRef = ref<HTMLElement>()

const userEmail = computed(() => authStore.user?.email || '')
const userInitial = computed(() => {
  return userEmail.value.charAt(0).toUpperCase()
})

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}

async function handleSignOut() {
  await authStore.signOut()
  closeMenu()
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>