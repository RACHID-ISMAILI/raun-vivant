import { lazy, Suspense } from "react";

// Lazy load components for better performance
export const LazyAdmin = lazy(() => import("@/pages/admin"));
export const LazyIntentions = lazy(() => import("@/pages/intentions"));
export const LazyRaunDemo = lazy(() => import("@/pages/raun-demo"));

// Loading fallback component
export function LoadingFallback({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="h-screen bg-black text-green-500 font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <p className="text-lg">{message}</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component for lazy loading with Matrix-themed fallback
export function LazyWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      {children}
    </Suspense>
  );
}