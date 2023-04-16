import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <GoogleAnalytics googleAnalyticsId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
          <GoogleAdsense />
          <FaviconScripts />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const GoogleAdsense: React.FC = () => {
  return (
    <Script
      async
      data-ad-client="ca-pub-6958470270834145"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6958470270834145"
      crossOrigin="anonymous"
    />
  )
}

const GoogleAnalytics: React.FC<{
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

export const FaviconScripts = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
};
