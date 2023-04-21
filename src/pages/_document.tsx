import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import Link from "next/link";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <FaviconScripts />
        </Head>
        <body className="bg-base-100">
          <div className="min-h-screen">
            <Main />
          </div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <Link className="link link-hover" href="/policies/cookies">
              <p>Cookie Notice</p>
            </Link>
            <p>&#183;</p>
            <Link href="/policies/privacy-policy" className="link link-hover">
              <p>Privacy Police</p>
            </Link>
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

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

export const FaviconScripts = () => {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
    </>
  )
};
