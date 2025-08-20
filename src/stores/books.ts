import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Book, UserBook } from "@/types/book";
import { supabase } from "@/services/supabase";

export const useBookStore = defineStore("books", () => {
  const userBooks = ref<UserBook[]>([]);
  const loading = ref(false);

  const readBooks = computed(() => userBooks.value.filter((ub) => ub.status === "read"));

  const toReadBooks = computed(() => userBooks.value.filter((ub) => ub.status === "to_read"));

  const currentlyReading = computed(() => userBooks.value.filter((ub) => ub.status === "reading"));

  async function addBookToLibrary(book: Book, status: UserBook["status"]) {
    try {
      loading.value = true;

      const { data: exisitingBook } = await supabase
        .from("books")
        .select("id")
        .eq("google_books_id", book.googleBooksId)
        .single();

      let bookId = exisitingBook?.id;

      if (!bookId) {
        const { data: newBook, error: bookError } = await supabase
          .from("books")
          .insert([
            {
              google_books_id: book.googleBooksId,
              title: book.title,
              author: book.author,
              isbn: book.isbn,
              description: book.description,
              cover_url: book.coverUrl,
              published_date: book.publishedDate,
              page_count: book.pageCount,
              average_rating: book.averageRating,
            },
          ])
          .select("id")
          .single();

        if (bookError) throw bookError;
        bookId = newBook.id;
      }


      const { data: userBook, error } = await supabase
        .from("user_books")
        .insert([
          {
            book_id: bookId,
            status,
            date_added: new Date().toISOString(),
          },
        ])
        .select(
          `
          *,
          book:books(*)
        `
        )
        .single();

      if (error) throw error;

      userBooks.value.push(userBook);
      return userBook;
    } catch (error) {
      console.error("Error adding book to library:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function updateBookStatus(userBookId: string, status: UserBook["status"]) {
    try {
      const updates: any = { status };

      if (status === "reading") {
        updates.date_started = new Date().toISOString();
      } else if (status === "read") {
        updates.date_finished = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("user_books")
        .update(updates)
        .eq("id", userBookId)
        .select()
        .single();

      if (error) throw error;

      const index = userBooks.value.findIndex((ub) => ub.id === userBookId);
      if (index !== -1) {
        userBooks.value[index] = { ...userBooks.value[index], ...data };
      }
    } catch (error) {
      console.error("Error updating book status:", error);
      throw error;
    }
  }

  async function fetchUserBooks() {
    try {
      loading.value = true;
      const { data, error } = await supabase
        .from("user_books")
        .select(
          `
          *,
          book:books(*)
        `
        )
        .order("date_added", { ascending: false });

      if (error) throw error;
      userBooks.value = data || [];
    } catch (error) {
      console.error("Error fetching user books:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    userBooks,
    loading,
    readBooks,
    toReadBooks,
    currentlyReading,
    addBookToLibrary,
    updateBookStatus,
    fetchUserBooks,
  };
});