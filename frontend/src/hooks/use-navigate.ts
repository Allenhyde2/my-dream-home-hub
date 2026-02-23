'use client';

import { useRouter, useParams as useNextParams } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigate() {
  const router = useRouter();
  
  return useCallback((to: string | number) => {
    if (typeof to === 'number') {
      if (to === -1) {
        router.back();
      } else {
        window.history.go(to);
      }
    } else {
      router.push(to);
    }
  }, [router]);
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string | string[]>>(): T {
  const params = useNextParams();
  return params as T;
}

export { useRouter };
