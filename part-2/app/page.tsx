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
    await fetchBooks(1, query.trim());
    setSearchState((prevState) => ({
      ...prevState,
      submittedQuery: query.trim(),
    }));
  };

  const changePage = async (change: number) => {
    if (loading) return;
    await fetchBooks(
      searchState.currentPage + change,
      searchState.submittedQuery
    );
  };

  const handlePrevPage = async () => changePage(-1);
  const handleNextPage = async () => changePage(1);

  return (
    <div className="container mx-auto px-4 py-3">
      {/* Search bar to find books based on keywords */}
      <div className="py-3">
        <input
          type="text"
          className="border px-3 py-1 sm:w-1/2 md:w-1/3 rounded-lg mr-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded-lg cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading || !query.trim()}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div>
        {/* Error message when there is an error invoking Google Books search API */}
        {searchState.hasError && (
          <p className="text-red-500 mb-3">
            Something went wrong, please try again.
          </p>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-75 z-10">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}

        {/* Search results */}
        {searchState.searched && searchState.results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          searchState.searched && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchState.results.map((book: any) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex flex-row gap-4 items-center border p-4 shadow-sm rounded-lg cursor-pointer hover:shadow-md transition"
                  >
                    <div className="rounded-lg shadow-md w-17 h-27 sm:w-17 sm:h-27 md:w-25 md:h-40">
                      {book.volumeInfo.imageLinks?.smallThumbnail ? (
                        <Image
                          src={book.volumeInfo.imageLinks.smallThumbnail}
                          alt={book.volumeInfo.title}
                          width={128}
                          height={205}
                          className="rounded-lg w-full h-full"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full rounded-lg flex justify-center items-center text-black">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold">{book.volumeInfo.title}</h2>
                      <p className="text-gray-600">
                        {book.volumeInfo.authors?.join(", ") ||
                          "Unknown Author"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-row justify-between items-center mt-6">
                <button
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  disabled={loading || searchState.currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </button>
                {`Page ${searchState.currentPage}/${Math.ceil(
                  searchState.totalItems / searchState.maxItemsPerPage
                )}`}
                <button
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
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
