import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import Link from "next/link";

export default class MyDocument extends Document {
  render() {
    return (
      <Html
        className="bg-base-100 scroll-smooth overflow-x-hidden break-words whitespace-pre-wrap"
      >
        <Head>
          <FaviconScripts />
        </Head>
        <body className="">
          <div className="min-h-screen">
            <Main />
          </div>
          <div className="flex justify-center items-center gap-2 mb-2 text-xs">
            <Link className="link link-hover" href="/policies/cookies">
              <p>Cookie Notice</p>
            </Link>
            <p>&#183;</p>
            <Link href="/policies/privacy-policy" className="link link-hover">
              <p>Privacy Policy</p>
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

export const FaviconScripts = () => {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicons/favicon.png" />
    </>
  )
};
