import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto p-8 flex flex-col items-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Not Found</h1>
      <p className="text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-500 hover:text-blue-700">
        Go back to the homepage
      </Link>
    </div>
  );
}
