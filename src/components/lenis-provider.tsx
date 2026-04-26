// src/components/lenis-provider.tsx
'use client';

import { initLenis } from '@/lib/lenis';
import { useEffect, ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = initLenis();
    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
