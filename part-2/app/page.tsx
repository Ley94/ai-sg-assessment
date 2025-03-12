"use client";

import { useState } from "react";
import { getBooks } from "./utils/google-books-api/googleBooksApi";

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
    <div>
      <input
        type="text"
        className="border"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
      />
      <button disabled={loading || !query.trim()} onClick={handleSearch}>
        Search
      </button>

      <div>
        {searchState.hasError && <p>Something went wrong, please try again.</p>}

        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-75 z-10">
            <div className="spinner">Loading...</div>
          </div>
        )}

        {searchState.searched && searchState.results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          searchState.searched && (
            <div>
              <div>
                {searchState.results.map((book: any) => (
                  <div key={book.id} className="border p-4 shadow-sm">
                    <h1 className="font-bold">{book.volumeInfo.title}</h1>
                    <p>{book.volumeInfo.authors?.join(", ")}</p>
                  </div>
                ))}
              </div>
              <div>
                <button
                  className="mr-2"
                  disabled={loading || searchState.currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </button>
                {`${searchState.currentPage}/${Math.ceil(
                  searchState.totalItems / searchState.maxItemsPerPage
                )}`}
                <button
                  className="ml-2"
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
