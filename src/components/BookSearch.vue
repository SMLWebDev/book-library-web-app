<template>
  <div class="mb-8">
    <div class="flex gap-4 mb-6">
      <FloatLabel variant="on" class="bg-transparent">
        <InputText 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            id="on_label" 
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <label for="on_label">Search</label>
      </FloatLabel>
      <Button
        @click="handleSearch"
        :disabled="!searchQuery.trim() || isSearching"
        class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSearching ? 'Searching...' : 'Search' }}
      </Button>
    </div>

    <div v-if="searchResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="book in searchResults"
        :key="book.id"
        :book="book"
        @add-to-library="handleAddToLibrary"
      />
    </div>

    <div v-else-if="hasSearched && !isSearching" class="text-center text-gray-500 py-8">
      No books found for "{{ lastSearchQuery }}"
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import BookCard from './BookCard.vue'
import { bookApi, type GoogleBook } from '@/services/bookApi'
import type { Book } from '@/types/book'
import { useBookStore } from '@/stores/books'

import { Button, InputText, FloatLabel } from 'primevue'

const searchQuery = ref('')
const lastSearchQuery = ref('')
const hasSearched = ref(false)
const bookStore = useBookStore()

const { data, isLoading: isSearching, refetch } = useQuery({
  queryKey: ['bookSearch', lastSearchQuery],
  queryFn: () => bookApi.searchBooks(lastSearchQuery.value),
  enabled: false
})

const searchResults = computed(() => Array.isArray(data.value) ? data.value : [])

function handleSearch() {
  if (!searchQuery.value.trim()) return
  
  lastSearchQuery.value = searchQuery.value.trim()
  hasSearched.value = true
  refetch()
}

function googleBookToBook(googleBook: GoogleBook): Book {
  const volumeInfo = googleBook.volumeInfo
  return {
    id: googleBook.id,
    googleBooksId: googleBook.id,
    title: volumeInfo.title,
    author: volumeInfo.authors?.join(', ') || 'Unknown Author',
    description: volumeInfo.description,
    coverUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
    publishedDate: volumeInfo.publishedDate,
    pageCount: volumeInfo.pageCount,
    averageRating: volumeInfo.averageRating,
    isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
  }
}

async function handleAddToLibrary(googleBook: GoogleBook) {
  try {
    const book = googleBookToBook(googleBook)
    await bookStore.addBookToLibrary(book, 'to_read')
    // You might want to show a success message here
  } catch (error) {
    console.error('Failed to add book to library:', error)
    // You might want to show an error message here
  }
}
</script>