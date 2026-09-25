"use client";

import type { ReactNode } from "react";
import { PortfolioProvider, DynamicHead } from "@/lib/store";

/** Client providers mounted once at the root, wrapping every page. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PortfolioProvider>
      <DynamicHead />
      {children}
    </PortfolioProvider>
  );
}
