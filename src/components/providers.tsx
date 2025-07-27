"use client";

import { AppProgressProvider } from "@bprogress/next";
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { Provider as JotaiProvider } from "jotai";
import { LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import ClientComponent from "@/app/ClientComponent";

const loadFeatures = () => import("motion/react").then((res) => res.domMax);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        storageKey="theme"
        defaultTheme="system"
        attribute="class"
      >
        <AppProgressProvider
          color="var(--color-info)"
          height="2px"
          delay={500}
          options={{ showSpinner: false }}
        >
          <LazyMotion features={loadFeatures} strict>
            {children}
          </LazyMotion>
        </AppProgressProvider>

        <Toaster />
        {/* <Analytics />
        <SpeedInsights /> */}
      </ThemeProvider>

      <ClientComponent />
    </JotaiProvider>
  );
}
