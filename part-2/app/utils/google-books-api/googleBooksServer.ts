"use server";

import ApiError from "@/app/errors/ApiError";

const BASE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_BASE_URL ||
  "https://www.googleapis.com/books/v1";

export const getBookDetails = async (bookId: string) => {
  const res = await fetch(`${BASE_URL}/volumes/${bookId}`);
  if (!res.ok) {
    throw new ApiError();
  }
  return await res.json();
};
