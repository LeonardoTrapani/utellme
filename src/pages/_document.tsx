import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default class MyDocument extends Document {
  render() {
    return (
      <Html
        className="bg-base-100 dark:bg-base-300 scroll-smooth overflow-x-hidden break-words whitespace-pre-wrap"
      >
        <Head>
          <FaviconScripts />
        </Head>
        <body className="">
          <div className="min-h-screen">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export const Footer = () => {
  return (
    <div className="flex justify-center items-center gap-2 mb-2 text-xs">
      <Link className="link link-hover" href="/policies/cookies">
        <p>Cookie Notice</p>
      </Link>
      <p>&#183;</p>
      <Link href="/policies/privacy-policy" className="link link-hover">
        <p>Privacy Policy</p>
      </Link>
    </div>
  )
}

export const FaviconScripts = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#eab308" />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
      <meta name="msapplication-TileColor" content="#eab308" />
      <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
};
