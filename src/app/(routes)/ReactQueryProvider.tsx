"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QueryParamsProvider } from "@/hooks/queryParamsProvider";
const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryParamsProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryParamsProvider>
  );
};

export default ReactQueryProvider;