import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

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
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <AnalyticsComponent />
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

const AnalyticsComponent = () => {
  return (
    <>
      <GoogleAnalytics />
      {/*
      <Analytics />
      */}
    </>
  )
}

const GoogleAnalytics = () => {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-513VZS4QZ5" />
      <Script id="google-analytics-tag">
        {
          `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-513VZS4QZ5');`
        }
      </Script>
    </>
  )
}

export default api.withTRPC(MyApp);
