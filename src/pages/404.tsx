import Head from "next/head";
import React from "react";
import NotFoundPage from "~/components/NotFoundPage";

const NotFoundRoute: React.FC = () => {
  return (
    <>
      <Head>
        <title>uTellMe</title>
        <meta name="description" content="get free quick and easy feedback with uTellMe" />
      </Head>

      <NotFoundPage />
    </>
  );
}

export default NotFoundRoute;
