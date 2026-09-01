// providers/app-providers.tsx
"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

/**
 * Composes every app-wide provider in one place. As auth, tenant, and
 * three.js context providers are added (see the file tree's
 * AuthProvider.tsx / TenantProvider.tsx / ThreeProvider.tsx), nest them
 * here rather than in app/layout.tsx directly — keeps the root layout
 * readable and gives every route the same provider stack without
 * duplicating it in nested layouts.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
