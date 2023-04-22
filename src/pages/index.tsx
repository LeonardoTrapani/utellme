import React, { useEffect } from "react";
import Head from "next/head"
import type { GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { UTellMeComponent } from "~/components/UTellMeComponent";
import Link from "next/link";
import { useIsInViewport } from "~/utils/hooks";

const Index: React.FC = () => {
  return (
    <>
      <Head>
        <title>utellme</title>
        <meta name="description" content="utellme is a web app to get the most efficient feedback with utellme." />
      </Head>
      <main>
        <Hero />
        <GiveFeedbackSteps />
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

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-base-300">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="max-w-sm rounded-lg">
          <UTellMeComponent isBig />
        </div>
        <div>
          <h1 className="text-5xl font-bold">The Most Efficient Feedback!</h1>
          <p className="py-6">Why would anyone spend more than one minute giving feedback? There is no reason! This is where UTellMe comes in. Don&apos;t waste the time of your collegues, friends or family and <span className="text-primary">actually</span> get feedback</p>
          <Link href="/auth/signin" className="btn btn-primary h-12 w-36">SIGN IN</Link>
        </div>
      </div>
    </div>
  )
}

const GiveFeedbackSteps = () => {
  return (
    <div className="bg-base-100 p-20">
    </div>
  )
}

export default Index;
