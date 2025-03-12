import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <Link href="/" className="text-gray-700 hover:text-black">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
