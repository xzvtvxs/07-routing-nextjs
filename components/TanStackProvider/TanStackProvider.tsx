// TanStackProvider.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function TanStackProvider({
  children,
}: {
  children: ReactNode;
}) {
  // QueryClient через useState, щоб забезпечити тільки один екземпляр
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
