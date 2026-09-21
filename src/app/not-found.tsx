import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs font-semibold text-secondary">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Error 404</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-primary tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm text-secondary leading-relaxed max-w-sm mx-auto">
          The customer page or store catalog item you are looking for doesn&apos;t exist, has been relocated, or is temporarily unavailable.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
