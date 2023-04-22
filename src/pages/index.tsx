import React from "react";
import Head from "next/head"
import type { GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";

const Index: React.FC = () => {
  return (
    <>
      <Head>
        <title>utellme</title>
        <meta name="description" content="utellme is a web app to get the most efficient feedback with utellme." />
      </Head>
      <main>
        <div className="p-10">
          <h1>utellme</h1>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/dashboard" } };
  }
  return {
    props: {}
  };
}

export default Index;
