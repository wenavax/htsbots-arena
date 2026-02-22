"use client";

import { useState, useEffect, type ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative min-h-screen grid-bg">
        <main>{children}</main>
      </div>
    );
  }

  return <MountedLayout>{children}</MountedLayout>;
}

function MountedLayout({ children }: { children: ReactNode }) {
  // Only import after mount to avoid SSR/prerender issues
  const [Layout, setLayout] = useState<{
    Providers: React.ComponentType<{ children: ReactNode }>;
    Navbar: React.ComponentType;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import("./providers").then((m) => m.Providers),
      import("@/components/Navbar").then((m) => m.Navbar),
    ]).then(([Providers, Navbar]) => {
      setLayout({ Providers, Navbar });
    });
  }, []);

  if (!Layout) {
    return (
      <div className="relative min-h-screen grid-bg">
        <div className="sticky top-0 z-50 border-b-2 border-gray-800 bg-gray-950/90 backdrop-blur-md h-16" />
        <main>{children}</main>
      </div>
    );
  }

  const { Providers, Navbar } = Layout;

  return (
    <Providers>
      <div className="relative min-h-screen grid-bg">
        <Navbar />
        <main>{children}</main>
      </div>
    </Providers>
  );
}
