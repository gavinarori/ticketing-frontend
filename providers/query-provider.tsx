// providers/query-provider.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState (not module scope) so each request gets its own client on the
  // server, and the client only constructs once per browser session.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Fixture/event data is fairly stable; seat *inventory* is not —
            // lib/api/inventory.ts's queries should override this down to a
            // few seconds (or use polling/websocket) rather than relying on
            // this default.
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
