"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/reactquery";
import {useState} from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}