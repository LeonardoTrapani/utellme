import Head from "next/head";
import React from "react";
import { UTellMeComponent } from "~/components/UTellMeComponent";

const IndexSettings = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="uTellMe settings" />
      </Head>
      <body>
        <div className="max-w-4xl m-auto p-2">
          <div className="flex items-center">
            <UTellMeComponent />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <div className="divider my-1" />
        </div>
      </body>
    </>
  );
};

export default IndexSettings;
