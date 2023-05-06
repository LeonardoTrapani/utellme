import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { Analytics } from '@vercel/analytics/react';
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Analytics />
      <Toaster toastOptions={{
        style: {
          background: "#1A1A1A",
          color: "#D3D3D3",
        }
      }}
      />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export const GoogleAdsense: React.FC = () => {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6958470270834145"
      crossOrigin="anonymous"
    />
  )
}

export default api.withTRPC(MyApp);
