import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      initialized.value = true
    }
  }

  async function signUp(email: string, password: string) {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      user.value = data.user
      return data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Initialize auth state
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    initialize,
    signUp,
    signIn,
    signOut
  }
})