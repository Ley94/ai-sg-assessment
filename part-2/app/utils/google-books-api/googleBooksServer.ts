"use server";

import ApiError from "@/app/errors/ApiError";

const BASE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_BASE_URL ||
  "https://www.googleapis.com/books/v1";

/**
 * Fetches details of a book from the Google Books API (https://developers.google.com/books/docs/v1/reference/volumes/get).
 *
 * @param {string} bookId - The ID of the book whose details are to be fetched.
 * @returns {Promise<any>} A Promise that resolves to the book details as a JSON object (See https://developers.google.com/books/docs/v1/reference/volumes#resource).
 * @throws {ApiError} If the API request fails or the response is not successful (non-2xx status).
 *
 * @example
 * const bookDetails = await getBookDetails('book-id-123');
 * console.log(bookDetails); // Logs the details of the book.
 */
export const getBookDetails = async (bookId: string) => {
  const res = await fetch(`${BASE_URL}/volumes/${bookId}`);
  if (!res.ok) {
    throw new ApiError();
  }
  return await res.json();
};
