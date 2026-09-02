// providers/app-providers.tsx
"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";

/**
 * Composes every app-wide provider in one place. AuthProvider must nest
 * inside QueryProvider — it uses useQuery/useMutation internally. As
 * TenantProvider / ThreeProvider are added later, they go here too rather
 * than in app/layout.tsx directly.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}