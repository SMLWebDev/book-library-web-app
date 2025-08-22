<template>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ isLogin ? 'Sign In' : 'Sign Up' }}
                </h2>
                <Button
                    @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </Button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <FloatLabel variant="on">
                        <InputText 
                            id="email"
                            v-model="email"
                            type="email"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <label for="email">
                            Email
                        </label>
                    </FloatLabel>
                </div>

                <div>
                    <FloatLabel variant="on">
                        <Password 
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            :minlength="isLogin ? 1: 6"
                            toggleMask
                            :pt="{
                                'pcInputText': {
                                    root: {
                                        class: 'w-full'
                                    }
                                }
                            }"
                        />
                        <label for="password">
                            Password
                        </label>
                    </FloatLabel>
                </div>

                <div v-if="error" class="text-red-600 text-sm">
                    {{ error }}
                </div>

                <div v-if="message" class="text-green-600 text-sm">
                    {{ message }}
                </div>

                <Button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ loading ? 'Loading...' : (isLogin ? 'Sign In': 'Sign Up') }}
                </Button>
                
                <div class="mt-6 text-center">
                    <Button
                        @click="toggleMode"
                        class="text-primary-600 hover:text-primary-700 text-sm"
                    >
                        {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In" }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

import { Button, FloatLabel, InputText, Password } from 'primevue'

// Removed unused props variable
defineProps<{
    showModal: boolean
}>()

const emit = defineEmits<{
    close: []
    success: []
}>()

const authStore = useAuthStore()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const error = ref('')
const message = ref('')
const loading = ref(false)

function toggleMode() {
    isLogin.value = !isLogin.value
    error.value = ''
    message.value = ''
}

async function handleSubmit() {
    if (!email.value || !password.value) return

    loading.value = true
    error.value = ''
    message.value = ''

    try {
        if (isLogin.value) {
            await authStore.signIn(email.value, password.value)
            emit('success')
        } else {
            await authStore.signUp(email.value, password.value)
            message.value = 'Check your email for verification link!'
            setTimeout(() => {
                emit('success')
            }, 2000)
        } 
    } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'message' in err) {
            error.value = (err as { message?: string }).message || 'An error occured'
        } else {
            error.value = 'An error occured'
        }
    } finally {
        loading.value = false
    }
}
</script>