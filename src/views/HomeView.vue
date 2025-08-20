<template>
    <div>
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
                Welcome to your personal Library
            </h1>
            <p class="text-gray-600 max-w-2xl mx-auto">
                Search for books, add them to your library, and keep track of what you want to read, what you're currently reading, and what you've finished.
            </p>
        </div>

        <BookSearch />
    </div>
</template>

<script setup lang="ts">
import BookSearch from '@/components/BookSearch.vue';
</script>