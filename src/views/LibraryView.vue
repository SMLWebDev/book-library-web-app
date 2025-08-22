<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Library</h1>
      <div class="text-sm text-gray-500">
        {{ readBooks.length }} books read
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Loading your books...</div>
    </div>

    <div v-else-if="readBooks.length === 0" class="text-center py-12">
      <div class="text-gray-500 mb-4">You haven't marked any books as read yet.</div>
      <RouterLink 
        to="/" 
        class="text-primary-600 hover:text-primary-700 underline"
      >
        Search for books to add to your library
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BookCard
        v-for="userBook in readBooks"
        :key="userBook.id"
        :book="transformUserBookToBook(userBook)"
      >
        <template #actions>
          <div class="flex flex-col gap-2">
            <div class="text-xs text-gray-500">
              Read on {{ formatDate(userBook.dateFinished) }}
            </div>
            <select
              :value="userBook.status"
              @change="updateStatus(userBook.id, ($event.target as HTMLSelectElement).value as BookStatus)"
              class="text-xs border rounded px-2 py-1"
            >
              <option value="read">Read</option>
              <option value="reading">Reading</option>
              <option value="to_read">To Read</option>
            </select>
          </div>
        </template>
      </BookCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BookCard from '@/components/BookCard.vue'
import { useBookStore } from '@/stores/books'
import type { UserBook, Book } from '@/types/book'
import { storeToRefs } from 'pinia'

const bookStore = useBookStore()

const { readBooks, loading } = storeToRefs(bookStore)

function transformUserBookToBook(userBook: UserBook): Book {
  return {
    id: userBook.book?.id || userBook.bookId,
    googleBooksId: userBook.book?.googleBooksId,
    title: userBook.book?.title || '',
    author: userBook.book?.author || '',
    description: userBook.book?.description,
    coverUrl: userBook.book?.coverUrl,
    publishedDate: userBook.book?.publishedDate,
    pageCount: userBook.book?.pageCount,
    averageRating: userBook.book?.averageRating,
    isbn: userBook.book?.isbn
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

type BookStatus = UserBook['status']

async function updateStatus(userBookId: string, newStatus: BookStatus) {
  try {
    await bookStore.updateBookStatus(userBookId, newStatus)
  } catch (error) {
    console.error('Failed to update book status:', error)
  }
}
</script>