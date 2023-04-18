import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import * as gtag from "~/utils/gtag";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Script from "next/script";
import { useCookieConsent } from "~/utils/hooks";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [cookieConsent, setCookieConsent] = useCookieConsent();

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {
        !cookieConsent && (
          <div className="">
          </div>
        )
      }
      <GoogleAnalytics googleAnalyticsId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
      <GoogleAdsense />
      <Toaster toastOptions={{
        style: {
          background: "#252932",
          color: "#A7ADBA",
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
      data-ad-client="ca-pub-6958470270834145"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6958470270834145"
      crossOrigin="anonymous"
    />
  )
}

export const GoogleAnalytics: React.FC<{
  googleAnalyticsId: string;
}> = (props) => {
  return (
    <>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${props.googleAnalyticsId}`}
      />
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

export default api.withTRPC(MyApp);

// In order to give you the best experience, we and our third party partners may use cookies and similar technologies, for example, to analyze usage and optimize our sites and services, personalize content, tailor and measure our marketing and to keep the site secure. Please visit our privacy notice for more information and our cookies notice for a list of all cookies used. Our Cookies Notice

