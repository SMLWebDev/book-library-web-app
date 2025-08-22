<template>
    <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Loading book details...</div>
    </div>

    <div v-else-if="!userBook" class="text-center py-12">
        <div class="text-gray-500 mb-4">Book not found in your library</div>
        <RouterLink
            to="/library"
            class="text-primary-600 hover:text-primary-700 underline"
        >
            Back to Library
        </RouterLink>
    </div>

    <div v-else class="max-w-4xl mx-auto">
        <div class="mb-6">
            <Button
                @click="goBack"
                severity="secondary"
                outlined
                class="mb-4"
            >
                <i class="pi pi-arrow-left mr-2"></i>
                Back to Library
            </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1">
                <div class="sticky top-4">
                    <img
                        :src="userBook.book?.coverUrl"
                        :alt="userBook.book?.title"
                        class="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                    >

                    <div class="mt-4 text-center">
                        <Tag
                            :value="getStatusLabel(userBook.status)"
                            :severity="getStatusSeverity(userBook.status)"
                            class="text-lg px-4 py-2"
                        />
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Reading Status
                        </label>
                        <Dropdown
                            v-model="userBook.status"
                            @update:modelValue="updateStatus"
                            :options="statusOptions"
                            optionLabel="label"
                            optionValue="value"
                            class="w-full"
                        />
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font=medium text-gray-700 mb-2">
                            Your Rating
                        </label>
                        <Rating 
                            v-model="personalRating"
                            @update:modelValue="updateRating"
                            :cancel="true"
                        />
                    </div>
                </div>
            </div>

            <!-- Book Details -->
            <div class="md:col-span-2">
                <div class="space-y-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">
                            {{ userBook.book?.title }}
                        </h1>
                        <p class="text-xl text-gray-600 mb-4">
                            by {{ userBook.book?.author }}
                        </p>

                        <div v-if="userBook.book?.averageRating" class="flex items-center mb-4">
                            <Rating 
                                :modelValue="userBook.book.averageRating"
                                readonly
                                :cancel="false"
                            />
                            <span class="ml-2 text-gray-600">
                                ({{ userBook.book.averageRating }}/5)
                            </span>
                        </div>
                    </div>

                    <div v-if="userBook.book?.description">
                        <h2 class="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                        <div class="prose prose-gray max-w-none">
                        <p class="text-gray-700 leading-relaxed">
                            {{ userBook.book.description }}
                        </p>
                        </div>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-3">Book Information</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-if="userBook.book?.isbn" class="bg-gray-50 p-3 rounded-lg">
                            <div class="text-sm font-medium text-gray-500">ISBN</div>
                            <div class="text-gray-900">{{ userBook.book.isbn }}</div>
                        </div>
                        
                        <div v-if="userBook.book?.publishedDate" class="bg-gray-50 p-3 rounded-lg">
                            <div class="text-sm font-medium text-gray-500">Published</div>
                            <div class="text-gray-900">{{ formatPublishedDate(userBook.book.publishedDate) }}</div>
                        </div>
                        
                        <div v-if="userBook.book?.pageCount" class="bg-gray-50 p-3 rounded-lg">
                            <div class="text-sm font-medium text-gray-500">Pages</div>
                            <div class="text-gray-900">{{ userBook.book.pageCount }}</div>
                        </div>
                        
                        <div class="bg-gray-50 p-3 rounded-lg">
                            <div class="text-sm font-medium text-gray-500">Added to Library</div>
                            <div class="text-gray-900">{{ formatDate(userBook.dateAdded) }}</div>
                        </div>
                        </div>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-3">Reading Timeline</h2>
                        <div class="space-y-3">
                        <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                            <i class="pi pi-plus-circle text-blue-500 mr-3"></i>
                            <div>
                            <div class="font-medium text-blue-900">Added to Library</div>
                            <div class="text-sm text-blue-700">{{ formatDate(userBook.dateAdded) }}</div>
                            </div>
                        </div>
                        
                        <div v-if="userBook.dateStarted" class="flex items-center p-3 bg-yellow-50 rounded-lg">
                            <i class="pi pi-play text-yellow-500 mr-3"></i>
                            <div>
                            <div class="font-medium text-yellow-900">Started Reading</div>
                            <div class="text-sm text-yellow-700">{{ formatDate(userBook.dateStarted) }}</div>
                            </div>
                        </div>
                        
                        <div v-if="userBook.dateFinished" class="flex items-center p-3 bg-green-50 rounded-lg">
                            <i class="pi pi-check-circle text-green-500 mr-3"></i>
                            <div>
                            <div class="font-medium text-green-900">Finished Reading</div>
                            <div class="text-sm text-green-700">{{ formatDate(userBook.dateFinished) }}</div>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-3">Personal Notes</h2>
                        <Textarea 
                        v-model="personalNotes"
                        @blur="updateNotes"
                        rows="4"
                        class="w-full"
                        placeholder="Add your personal notes about this book..."
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Button, Dropdown, Tag, Rating, Textarea } from 'primevue'
import { useBookStore } from '@/stores/books'

const props = defineProps<{
    id: string
}>()

const router = useRouter()
const bookStore = useBookStore()
const { allBooks, loading } = storeToRefs(bookStore)

const personalRating = ref(0)
const personalNotes = ref('')

const statusOptions = ref([
    { label: 'To Read', value: 'to_read' },
    { label: 'Reading', value: 'reading' },
    { label: 'Read', value: 'read' }
])

const userBook = computed(() => 
    allBooks.value.find(book => book.id === props.id)
)

function goBack() {
    router.push('/library')
}

function getStatusLabel(status: string) {
    switch (status) {
        case 'to_read': return 'To Read'
        case 'reading': return 'Reading'
        case 'read': return 'Read'
        default: return status
    }
}

function getStatusSeverity(status: string) {
    switch (status) {
        case 'to_read': return 'info'
        case 'reading': return 'warning'
        case 'read': return 'success'
        default: return 'secondary'
    }
}

function formatDate(dateString?: string) {
    if (!dateString) return 'Not Set'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

function formatPublishedDate(dateString?: string) {
    if (!dateString) return 'Unknown'
    if (dateString.includes('-')) {
        return new Date(dateString).getFullYear().toString()
    }
    return dateString
}

async function updateStatus(newStatus: string) {
    if (!userBook.value) return

    try {
        await bookStore.updateBookStatus(userBook.value.id, newStatus as 'to_read' | 'reading' | 'read')
    } catch (error) {
        console.error('Failed to update book status: ', error)
    }
}

async function updateRating(rating: number) {
    console.log('Update rating to: ', rating)
}

async function updateNotes() {
    console.log('Update notes to: ', personalNotes.value)
}

watch([userBook], () => {
    if (userBook.value) {
        personalRating.value = userBook.value.personalRating || 0
        personalNotes.value = userBook.value.personalNotes || ''
    }
}, { immediate: true })

onMounted(() => {
    if (allBooks.value.length === 0) {
        bookStore.fetchUserBooks()
    }
})
</script>