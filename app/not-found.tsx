import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">404 - Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find requested resource.</p>
      <Link 
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
