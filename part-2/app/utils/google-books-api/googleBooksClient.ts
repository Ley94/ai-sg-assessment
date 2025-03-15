"use client";

import ApiError from "@/app/errors/ApiError";

const BASE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_BASE_URL ||
  "https://www.googleapis.com/books/v1";

/**
 * Fetches a list of books from the Google Books API (https://developers.google.com/books/docs/v1/reference/volumes/list) based on a search query.
 * The search results are paginated, and you can specify the page number and the maximum number of results per page.
 *
 * @param {string} query - The search query to find books (e.g., title, author, etc.).
 * @param {number} [page=1] - The page number of the results to fetch (default is 1).
 * @param {number} [maxResults=10] - The maximum number of results per page (default is 10).
 * @returns {Promise<{ totalItems: number, items: any[] }>} A Promise that resolves to an object containing the total number of results (`totalItems`) and an array of book items (`items`).
 * @throws {ApiError} If the API request fails or the response is not ok.
 *
 * @example
 * const { totalItems, items } = await getBooks('JavaScript', 1, 5);
 * console.log(totalItems); // Total number of books found.
 * console.log(items); // Array of books with details.
 */
export const getBooks = async (query: string, page = 1, maxResults = 10) => {
  const orderBy = "relevance";
  const startIndex = (page - 1) * maxResults;
  const res = await fetch(
    `${BASE_URL}/volumes?q=${query}&orderBy=${orderBy}&maxResults=${maxResults}&startIndex=${startIndex}`
  );
  if (!res.ok) {
    throw new ApiError();
  }
  const data = await res.json();
  if (!data.totalItems) {
    return {
      totalItems: 0,
      items: [],
    };
  } else {
    return {
      totalItems: data.totalItems,
      items: data.items,
    };
  }
};
