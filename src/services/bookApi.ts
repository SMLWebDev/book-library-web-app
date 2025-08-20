import axios from 'axios'

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1'

export interface GoogleBook {
    id: string
    volumeInfo: {
        title: string
        authors?: string[]
        description?: string
        publishedDate?: string
        pageCount?: number
        imageLinks?: {
            thumbnail?: string
            small?: string
            medium?: string
        }
        industryIdentifiers?: Array<{
            type: string
            identifier: string
        }>
        averageRating?: number
    }
}

export const bookApi = {
    async searchBooks(query: string): Promise<GoogleBook[]> {
        try {
            const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
                params: {
                    q: query,
                    maxResults: 20,
                    key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
                }
            })
            return response.data.items || []
        } catch (error) {
            console.error('Error searching books: ', error)
            return []
        }
    },

    async getBooksByISBN(isbn: string): Promise<GoogleBook | null> {
        try {
            const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
                params: {
                    q: `isbn:${isbn}`,
                    key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
                }
            })
            return response.data.items?.[0] || null
        } catch (error) {
            console.error('Error fetching book by ISBN: ', error)
            return null
        }
    }
}