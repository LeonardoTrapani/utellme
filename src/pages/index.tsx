import React, { useState } from "react";
import Head from "next/head"
import type { GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import { UTellMeComponent } from "~/components/UTellMeComponent";
import Link from "next/link";
import ScarnQRIllustration from "../assets/scan qr illustration.svg"
import LoginIllustration from "../assets/login illustration.svg"
import LoginIllustrationDark from "../assets/login illustration-dark.svg"
import ScanQRIllustrationDark from "../assets/scan qr illustration-dark.svg"
import GiveFeedbackPhoto from "../assets/Give feedback photo.png"
import ShareMainScreenImage from "../assets/share-project-image.png"
import ViewFeedbackPageImage from "../assets/view-feedback-page.png"
import CreateProjectIllustration from "../assets/create-project-illustration.svg"
import CreateProjectIllustrationDark from "../assets/create-project-illustration-dark.svg"
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
        <Steps />
        <FAQ />
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
          <Link href="/auth/signin" className="btn btn-primary">Start for free</Link>
        </div>
      </div>
    </div>
  )
}

const Steps = () => {
  const [isCustomerSide, setIsCustomerSide] = useState(true);
  return (
    <div className="bg-base-100 p-20 max-w-5xl m-auto">
      <div className="text-center flex flex-col justify-center items-center gap-2">
        <p className="text-xl">It takes one minute for</p>
        <div className="btn-group mb-8">
          <button
            className={`btn ${isCustomerSide ? 'btn-active' : ''}`}
            onClick={() => {
              setIsCustomerSide(true);
            }}
          >
            your customer
          </button>
          <button
            className={`btn ${!isCustomerSide ? 'btn-active' : ''}`}
            onClick={() => {
              setIsCustomerSide(false);
            }}
          >
            you
          </button>
        </div>
        {isCustomerSide ? <YourCustomerPov /> : <YourPov />}
        <p className="text-6xl font-bold text-center mt-12">Done!</p>
      </div>
    </div>
  )
}

const YourPov = () => {
  const isDarkMode = useIsDarkMode();
  return (
    <div className="grid grid-cols-2 justify-center items-center gap-y-10">
      <StepsRow i={1} title="Create an account">
        {
          !isDarkMode ?
            <LoginIllustration /> :
            <LoginIllustrationDark />
        }
      </StepsRow>
      <StepsRow i={2} title="Create a project">
        {

        !isDarkMode ?
        <CreateProjectIllustration /> : 
        <CreateProjectIllustrationDark />
        }
      </StepsRow>
      <StepsRow i={3} title="Share the link / QR-Code">
        <PhoneMockup showMargin>
          <Image src={ShareMainScreenImage} alt="utellme main screen when you can share the link or the qr code" />
        </PhoneMockup>
      </StepsRow>
      <StepsRow i={4} title="View your feedback">
        <PhoneMockup showMargin>
          <Image src={ViewFeedbackPageImage} alt="utellme view feedback page" />
        </PhoneMockup>
      </StepsRow>
    </div>
  )
}
const YourCustomerPov = () => {
  const isDarkMode = useIsDarkMode();
  return (
    <>
      <div className="grid grid-cols-2 justify-center items-center gap-y-10">
        <StepsRow i={1} title="Scan the QR-Code">
          {
            !isDarkMode ?
              <ScarnQRIllustration /> : <ScanQRIllustrationDark />
          }
        </StepsRow>
        <StepsRow i={2} title="Write the feedback">
          <PhoneMockup>
            <Image src={GiveFeedbackPhoto} alt="give feedback from utellme mockup" />
          </PhoneMockup>
        </StepsRow>
      </div>
    </>
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
  showMargin?: boolean;
}> = (props) => {
  return (
    <div className="mockup-phone">
      <div className="camera"></div>
      <div className="display" style={props.showMargin ?
        {
          background: '#2B303C'
        } : {}
      }>
        <div className={`artboard artboard-demo phone-1 ${props.showMargin ? 'mt-8' : ''}`} style={{
          background: !props.showMargin ? '#252B34' : '#2B303C'
        }}>
          {
            props.children
          }
        </div>
      </div>
    </div>
  )
}

const FAQ = () => {
  return <div></div>
}

export default Index;
