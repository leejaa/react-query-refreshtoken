import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Hydrate, MutationCache, QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import React, { useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({}),
        mutationCache: new MutationCache({}),
        defaultOptions: {
          mutations: {
            retry: (failureCount, error: any) => {
              if (error?.message?.includes('401')) {
                localStorage.setItem('accessToken', 'true');
                localStorage.setItem('refreshToken', 'true');
                return true;
              }
            },
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
export default MyApp;
