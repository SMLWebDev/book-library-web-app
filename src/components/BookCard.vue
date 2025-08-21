<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img 
            :src="book.coverUrl" 
            :alt="book.title"
            class="w-full h-48 object-cover"
        />
        <div class="p-4">
            <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ book.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ book.author }}</p>
            <p v-if="book.description" class="text-gray-500 text-xs line-clamp-3 mb-3">{{ book.description }}</p>

            <div class="flex justify-between items-center">
                <div class="flex-items-center">
                    <span v-if="book.averageRating" class="text-yellow-500 text-sm">
                        {{ book.averageRating }}
                    </span>
                </div>

                <slot name="actions" :book="book">
                    <Button
                        @click="$emit('add-to-library', book)"
                        class="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 transition-colors"
                    >
                        Add to Library
                    </Button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from '@/types/book'

import { Button } from 'primevue'

defineProps<{
    book: Book
}>()

defineEmits<{
    'add-to-library': [book: Book]
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>