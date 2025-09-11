import { Suspense } from "react";
import MagicLink from "./magiclink";

export default function MagicLinkPage() {
  return (
    <Suspense fallback={<MagicLinkFallback />}>
      <MagicLink />
    </Suspense>
  );
}

function MagicLinkFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto" />
        <p className="text-gray-600">Preparing your login...</p>
      </div>
    </div>
  );
}
