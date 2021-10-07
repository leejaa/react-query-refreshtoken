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
                const isExistRefreshToken = !!localStorage.getItem('refreshToken');
                if (isExistRefreshToken) {
                  // refresh token 이 있다면 access token을 발급한 후 재시도한다
                  localStorage.setItem('accessToken', 'true');
                  return true;
                } else {
                  // refresh token 이 없다면 로그인페이지로 이동 (재시도 하지 않는다)
                  return false;
                }
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
