// app/(fan)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function FanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-paper)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}