import React from "react";
import Head from "next/head"
import type { GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { UTellMeComponent } from "~/components/UTellMeComponent";
import Link from "next/link";
import ScarnQRIllustration from "../assets/scan qr illustration.svg"
import ScanQRIllustrationDark from "../assets/scan qr illustration-dark.svg"
import GiveFeedbackPhoto from "../assets/Give feedback photo.png"
import Image from "next/image";
import { useIsDarkMode } from "~/utils/hooks";

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
          <h1 className="text-6xl font-bold">UTellMe</h1>
          <p className="py-6">No one would spend more than one minute giving feedback. Don&apos;t waste the time of your collegues, friends or family and <span className="text-primary">actually</span> get feedback with UTellMe.</p>
          <Link href="/auth/signin" className="btn btn-primary h-12 w-36">SIGN IN</Link>
        </div>
      </div>
    </div>
  )
}

const GiveFeedbackSteps = () => {
  const isDarkMode = useIsDarkMode();
  return (
    <div className="bg-base-100 p-20 max-w-5xl m-auto">
      <div className="grid grid-cols-2 justify-center items-center gap-y-5">
        <StepsRow i={1} title="Scan the QR-Code">
          {
            !isDarkMode ?
              <ScarnQRIllustration /> : <ScanQRIllustrationDark />
          }
        </StepsRow>
        <StepsRow i={2} title="Write your feedback">
          <PhoneMockup>
            <Image src={GiveFeedbackPhoto} alt="give feedback from utellme mockup" />
          </PhoneMockup>
        </StepsRow>
      </div>
      <p className="text-6xl font-bold text-center mt-12">Done!</p>
    </div>
  )
}

const StepsRow: React.FC<{
  title: string;
  children: React.ReactNode;
  i: number;
}> = (props) => {
  return (
    <>
      {
        props.i % 2 === 0 ? props.children : <></>
      }
      <div className="flex items-center gap-2 m-auto">
        <div className="font-bold  text-4xl bg-primary w-14 aspect-square flex justify-center items-center rounded-full">
          <p className="text-slate-200">
            {props.i}
          </p>
        </div>
        <p className="font-semibold text-3xl text-center">{props.title}</p>
      </div>
      {
        props.i % 2 !== 0 ? props.children : <></>
      }
    </>
  )
}

const PhoneMockup: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return (
    <div className="mockup-phone">
      <div className="camera"></div>
      <div className="display">
        <div className="artboard artboard-demo phone-1 " style={{
          background: '#252B34'
        }}>
          {
            props.children
          }
        </div>
      </div>
    </div>
  )
}

export default Index;
