import { useEffect, useState } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

const API_BASE = 'https://bookshelf-manager-pel5.vercel.app';

export default function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/books`)
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch books.');
        }
        return response.json();
      })
      .then(setBooks)
      .catch((err) => setError(err.message || 'Failed to fetch books.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddBook = async (title, author) => {
    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add book.');
      }
      const newBook = await response.json();
      setBooks((books) => [newBook, ...books]);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/books/${id}`, { method: 'PUT' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update book status.');
      }
      const updatedBook = await response.json();
      setBooks((books) =>
        books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete book.');
      }
      setBooks((books) => books.filter((book) => book.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
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
        {error && (
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
                <p className="text-sm text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
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
              books={books}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onDeleteBook={handleDeleteBook}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
