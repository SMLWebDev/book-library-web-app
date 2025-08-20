export interface Book {
    id: string
    googleBooksId?: string
    title: string
    author: string
    isbn?: string
    description?: string
    coverUrl?: string
    publishedDate?: string
    pageCount?: number
    averageRating?: number
}

export interface UserBook {
    id: string
    userId: string
    bookId: string
    status: 'to_read' | 'reading' | 'read'
    personalRating?: number
    dateAdded: string
    dateStarted?: string
    dateFinished?: string
    personalNotes?: string
    book?: Book
}