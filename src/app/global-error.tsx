"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Application Error</h1>
          <p className="text-sm text-slate-500">
            {error.message || "A critical error occurred. Please refresh or try again."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
