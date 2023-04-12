import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import Link from "next/link";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      {
        <>
          <GoogleAnalytics googleAnalyticsId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
        </>
      }
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster toastOptions={{
        style: {
          background: "#252932",
          color: "#A7ADBA",
        }
      }} />
    </>
  );
};

const GoogleAnalytics: React.FC<{
  googleAnalyticsId: string;
}> = (props) => {
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${props.googleAnalyticsId}`} />
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${props.googleAnalyticsId}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
    </>
  )
}

export const FaviconScripts = () => {
  return (
    <>
      <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <Link rel="icon" type="image/png" href="/favicon-32x32.png" />
      <Link rel="icon" type="image/png" href="/favicon-16x16.png" />
      <Link rel="manifest" href="/site.webmanifest" />
      <Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
}

export default api.withTRPC(MyApp);
