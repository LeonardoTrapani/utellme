import Head from "next/head";
import React from "react";
import NotFoundPage from "~/components/NotFoundPage";
import { FaviconScripts } from "./_app";

const NotFoundRoute: React.FC = () => {
  return (
    <>
      <Head>
        <title>uTellMe</title>
        <meta name="description" content="get free quick and easy feedback with uTellMe" />
        <FaviconScripts />
      </Head>

      <NotFoundPage />
    </>
  );
}

export default NotFoundRoute;
