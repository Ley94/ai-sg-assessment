"use server";

import Image from "next/image";
import { getBookDetails } from "@/app/utils/google-books-api/googleBooksServer";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let book = null;
  try {
    book = await getBookDetails(params.id);
  } catch (e) {
    return <NotFoundPage />;
  }

  const bookInfo = book.volumeInfo;
  const NA = "N/A";
  const author = bookInfo.authors?.join(", ") || "Unknown Author";
  const categories = bookInfo.categories?.join(", ") || NA;
  const publisher =
    bookInfo.publisher || "Publisher information not available.";
  const publishedDate = bookInfo.publishedDate || NA;
  const language = bookInfo.language || NA;
  const previewLink = bookInfo.previewLink || "No preview link available.";
  const description = bookInfo.description || "No description available.";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{bookInfo.title}</h1>
      <p className="text-gray-600 mb-4">by {author}</p>
      {bookInfo.imageLinks?.thumbnail ? (
        <Image
          src={bookInfo.imageLinks?.thumbnail}
          alt={bookInfo.title}
          className="rounded-lg mb-4"
          width={100}
          height={100}
        />
      ) : (
        <div className="bg-gray-200 w-[150px] h-[200px] mb-4 flex justify-center items-center text-center text-black">
          No Image
        </div>
      )}
      <div className="mb-4">
        <p className="font-semibold">Categories:</p>
        <p>{categories}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Publisher:</p>
        <p>{publisher}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Published Date:</p>
        <p>{publishedDate}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Language:</p>
        <p>{language}</p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Preview Link:</p>
        <Link
          href={previewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {previewLink}
        </Link>
      </div>
      <div>
        <p className="font-semibold mb-4">Description:</p>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}
