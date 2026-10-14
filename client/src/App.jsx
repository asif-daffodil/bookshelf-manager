import React, { useEffect, useReducer, useCallback } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import { getBooks, createBook, markBookAsRead, deleteBook } from './api/books';

// Initial state
const initialState = {
  books: [],
  isLoading: true,
  error: null,
};

// Reducer function managing all bookshelf state
function booksReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADD_BOOK':
      // Prepend the new book to keep newest first
      return {
        ...state,
        books: [action.payload, ...state.books],
        error: null,
      };
    case 'MARK_READ':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id ? action.payload : book
        ),
        error: null,
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(booksReducer, initialState);

  // Load books on mount
  const fetchBooks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await getBooks();
      dispatch({ type: 'SET_BOOKS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch books.' });
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handler: Add a new book
  const handleAddBook = async (title, author) => {
    try {
      const newBook = await createBook({ title, author });
      dispatch({ type: 'ADD_BOOK', payload: newBook });
      return true;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to add book.' });
      return false;
    }
  };

  // Handler: Mark book as read
  const handleMarkAsRead = async (id) => {
    try {
      const updatedBook = await markBookAsRead(id);
      dispatch({ type: 'MARK_READ', payload: updatedBook });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to update book status.' });
    }
  };

  // Handler: Delete book
  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to delete book.' });
    }
  };

  // Handler: Dismiss error banner
  const handleDismissError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-100 text-slate-800 antialiased">
      {/* Top Navigation / Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                BookShelf Manager
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Personal reading list & library tracker
              </p>
            </div>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            MERN Stack
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Dismissible Error Banner */}
        {state.error && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3 shadow-xs transition-all"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-rose-900">Request Failed</p>
                <p className="text-sm text-rose-700 mt-0.5">{state.error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-100/70 transition-colors cursor-pointer"
              aria-label="Dismiss error banner"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (Sticky on Desktop) */}
          <section className="lg:col-span-5 lg:sticky lg:top-24">
            <BookForm onAddBook={handleAddBook} />
          </section>

          {/* Right Column: Book List */}
          <section className="lg:col-span-7">
            <BookList
              books={state.books}
              isLoading={state.isLoading}
              onMarkAsRead={handleMarkAsRead}
              onDeleteBook={handleDeleteBook}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

