export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[var(--color-paper)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-sky)] border-t-transparent" />
    </div>
  );
}
