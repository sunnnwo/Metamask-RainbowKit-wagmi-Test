import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/index.css"; // index.css가 존재한다면 추가, 없으면 제거
import type { AppProps } from "next/app";
import { useState, useEffect } from "react"; // 추가

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS가 누락되었다면 추가

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 브라우저에 마운트된 후에만 렌더링하도록 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 마운트 전에는 아무것도 보여주지 않음 (500 에러 방지)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
