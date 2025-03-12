"use client";

import ApiError from "@/app/errors/ApiError";

const BASE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_BASE_URL ||
  "https://www.googleapis.com/books/v1";

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
