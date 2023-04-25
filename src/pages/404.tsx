import Head from "next/head";
import React from "react";
import NotFoundPage from "~/components/NotFoundPage";

const NotFoundRoute: React.FC = () => {
  return (
    <>
      <Head>
        <title>Page not Found</title>
        <meta name="description" content="This page of UTellMe wasn't found" />
      </Head>

      <NotFoundPage />
    </>
  );
}

export default NotFoundRoute;
