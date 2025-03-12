"use client";

import Link from "next/link";
import { useState } from "react";
import { getBooks } from "./utils/google-books-api/googleBooksApi";
import Image from "next/image";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState({
    submittedQuery: "",
    results: [],
    totalItems: 0,
    currentPage: 1,
    maxItemsPerPage: 10,
    searched: false,
    hasError: false,
  });

  const fetchBooks = async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const books = await getBooks(
        searchQuery,
        page,
        searchState.maxItemsPerPage
      );
      setSearchState((prevState) => ({
        ...prevState,
        results: books.items,
        totalItems: books.totalItems,
        currentPage: page,
        searched: true,
        hasError: false,
      }));
    } catch (e) {
      setSearchState((prevState) => ({
        ...prevState,
        hasError: true,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (loading) return;
    fetchBooks(1, query.trim());
    setSearchState((prevState) => ({
      ...prevState,
      submittedQuery: query.trim(),
    }));
  };

  const changePage = async (change: number) => {
    if (loading) return;
    fetchBooks(searchState.currentPage + change, searchState.submittedQuery);
  };

  const handlePrevPage = async () => changePage(-1);
  const handleNextPage = async () => changePage(1);

  return (
    <div className="container mx-auto px-4 py-3">
      <div className="py-3">
        <input
          type="text"
          className="border px-3 py-1 sm:w-1/2 md:w-1/3 rounded-lg mr-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading || !query.trim()}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div>
        {searchState.hasError && (
          <p className="text-red-500 mb-3">
            Something went wrong, please try again.
          </p>
        )}

        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-75 z-10">
            <div className="spinner border-4 border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          </div>
        )}

        {searchState.searched && searchState.results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          searchState.searched && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchState.results.map((book: any) => (
                  <div
                    key={book.id}
                    className="flex gap-4 items-center border p-4 shadow-sm rounded-lg hover:shadow-md transition"
                  >
                    <Link href={`/books/${book.id}`} className="flex gap-4">
                      {book.volumeInfo.imageLinks?.smallThumbnail ? (
                        <Image
                          src={book.volumeInfo.imageLinks.smallThumbnail}
                          alt={book.volumeInfo.title}
                          width={70}
                          height={70}
                          className="rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="bg-gray-200 mb-4 flex justify-center items-center text-center text-black p-2">
                          No Image
                        </div>
                      )}
                      <div>
                        <h1 className="font-bold">{book.volumeInfo.title}</h1>
                        <p className="text-gray-600">
                          {book.volumeInfo.authors?.join(", ") ||
                            "Unknown Author"}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
                  disabled={loading || searchState.currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </button>
                {`Page ${searchState.currentPage}/${Math.ceil(
                  searchState.totalItems / searchState.maxItemsPerPage
                )}`}
                <button
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
                  disabled={
                    loading ||
                    searchState.currentPage * searchState.maxItemsPerPage >=
                      searchState.totalItems
                  }
                  onClick={handleNextPage}
                >
                  Next
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
