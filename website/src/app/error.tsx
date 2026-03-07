'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-lg text-default-500">An unexpected error occurred.</p>
      <button
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
