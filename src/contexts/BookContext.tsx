import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/book';

interface BookContextData {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  updateReadingProgress: (bookId: string, currentPage: number) => Promise<void>;
  addNote: (bookId: string, note: string) => Promise<void>;
  addReview: (bookId: string, rating: number, text: string) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
}

const BookContext = createContext<BookContextData>({} as BookContextData);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('@BookTracker:books');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const saveBooks = async (updatedBooks: Book[]) => {
    try {
      await AsyncStorage.setItem('@BookTracker:books', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Error saving books:', error);
    }
  };

  const addBook = async (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      notes: [],
      currentPage: 0,
      lastUpdated: new Date().toISOString(),
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
  };

  const updateBook = async (updatedBook: Book) => {
    const updatedBooks = books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
  };

  const updateReadingProgress = async (bookId: string, currentPage: number) => {
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          currentPage,
          status: currentPage === book.totalPages ? 'completed' : 'reading',
          lastUpdated: new Date().toISOString(),
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
  };

  const addNote = async (bookId: string, note: string) => {
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          notes: [...book.notes, note],
          lastUpdated: new Date().toISOString(),
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
  };

  const addReview = async (bookId: string, rating: number, text: string) => {
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        return {
          ...book,
          review: {
            rating,
            text,
            date: new Date().toISOString(),
          },
          lastUpdated: new Date().toISOString(),
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
  };

  const removeBook = async (bookId: string) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        updateReadingProgress,
        addNote,
        addReview,
        removeBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
