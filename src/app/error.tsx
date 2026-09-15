"use client";

import * as React from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected client exceptions
    console.error("Vexlora application error:", error);
  }, [error]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-primary mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-primary">
            Something went wrong
          </h2>
          <p className="text-xs text-secondary leading-relaxed">
            {error.message ||
              "An unexpected error occurred while processing your request. Please try again."}
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-secondary opacity-70">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Home className="h-4 w-4" />}
              className="w-full"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
