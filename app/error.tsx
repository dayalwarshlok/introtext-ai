"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-2 bg-white text-gray-700 border rounded-xl hover:bg-gray-50 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
