import React, { useState } from "react";
import Head from "next/head"
import type { GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { isDarkMode, useWindowSize } from "~/utils/hooks";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";
import { BiMenu } from "react-icons/bi";

const Index: React.FC = () => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  return (
    <>
      <Head>
        <title>UTellMe</title>
        <meta name="description" content="utellme is a web app to get the most efficient feedback. It is fast, easy to configure and has a nice UI." />
      </Head>
      <main onClick={() => {
        if (isDrawerOpened) {
          setIsDrawerOpened(false);
        }
      }}>
        <Header onHeaderOpen={() => {
          setIsDrawerOpened(true)
        }} />
        <LandingDrawer isOpened={isDrawerOpened} />
        <div className="mb-20 flex flex-col gap-36 pt-28">
          <Hero />
          <Steps />
          <FAQ />
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

const Header: React.FC<{
  onHeaderOpen: () => void;
}> = (props) => {
  const isDarkModeVar = isDarkMode();
  return (
    <div className={`z-10 fixed w-full bg-gradient-to-b ${isDarkModeVar ? 'from-[#2B303B] via-[#2B303B]' : 'from-[#FFFFFF] via-[#FFFFFF]'}`}>
      <header className="relative py-4 md:py-6">
        <div className="px-10 mx-auto max-w-7xl from-blue-500 to-transparent sm:px-6 md:px-8 flex justify-between">
          <UTellMeComponentButton hasText />
          <div className="flex md:hidden items-center">
            <button onClick={() => {
              props.onHeaderOpen();
            }}>
              <BiMenu size={40} />
            </button>
          </div>
          <div className="hidden md:flex md:ml-16 md:items-center md:justify-center md:space-x-10">
            <a className="link link-hover" href="#discover-more">Discover More</a>
            <a className="link link-hover" href="#faq">Faq</a>
            <div className="divider divider-horizontal mx-0" />
            <Link href="/auth/signin" className="btn btn-primary btn-outline">Sign in</Link>
          </div>
        </div>
      </header>
    </div>
  )
}

const LandingDrawer: React.FC<{
  isOpened: boolean;
}> = (props) => {
  return (
    <>
      <div className={`p-10 md:hidden w-72 h-screen top-0 fixed z-50 bg-base-300 transition-all duration-300 ${props.isOpened ? 'left-0' : '-left-full'}`}>
        <UTellMeComponentButton hasText />
        <div className="flex flex-col py-4 gap-2">
          <Link href="/auth/signin" className="btn btn-primary btn-sm btn-outline">Sign in</Link>
          <div className="divider my-0" />
          <a className="link link-hover" href="#discover-more">Discover More</a>
          <a className="link link-hover" href="#faq">Faq</a>
        </div>
      </div>
    </>
  )
}

const Hero = () => {
  return (
    <>
      <section className="md:pt-10">
        <div className="px-10 mx-auto max-w-7xl sm:px-6 md:px-8">
          <div className="grid max-w-md grid-cols-1 mx-auto md:max-w-full md:items-center md:grid-cols-2 gap-y-12 md:gap-x-16">
            <div className="text-center md:text-left">
              <div className="">
                <h1 className="text-4xl font-bold sm:text-4xl md:text-5xl">Get <span className="text-primary">Feedback</span><br />in Seconds</h1>
                <p className="py-6">No one would spend more than one minute giving feedback. Don&apos;t waste the time of your collegues, friends or family and <span className="text-primary font-semibold">actually</span> get feedback with <span className="text-primary font-semibold">UTellMe</span>.</p>
              </div>
              <div>
                <ActionButton />
              </div>
            </div>
            <Image
              src="/assets/utellme-3d-mockup.png"
              className="w-52 md:w-72 lg:w-80 h-auto m-auto"
              height={0}
              width={0}
              sizes="100vh"
              priority
              alt="utellme main screen on a 3d iphone mockup"
            />
          </div>
        </div>
        <div id="discover-more" />
      </section>
    </>
  )
}

const ActionButton = () => {
  return (
    <Link href="/auth/signin" className="btn btn-primary">Start getting feedback</Link>
  )
}

const Steps = () => {
  const [isCustomerSide, setIsCustomerSide] = useState(true);
  return (
    <section className="max-w-5xl m-auto">
      <div className="text-center flex flex-col justify-center items-center gap-2">
        <p className="text-2xl font-semibold">It takes one minute for both</p>
        <div className="btn-group mb-4">
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
      </div>
    </section>
  )
}

const YourPov = () => {
  const isDarkModeVar = isDarkMode();
  return (
    <StepsRowContainer>
      <StepsRow i={1} title="Create an account">
        {
          !isDarkModeVar ?
            <div className="relative">
              <Image
                height={0}
                width={0}
                className="w-full px-10"
                src="/assets/login illustration.svg"
                alt="utellme login illustration"
              />
            </div>
            :
            <div className="relative">
              <Image
                height={0}
                width={0}
                className="w-full px-10"
                src="/assets/login illustration-dark.svg"
                alt="utellme login illustration"
              />
            </div>
        }
      </StepsRow>
      <StepsRow i={2} title="Create a project">
        {

          !isDarkModeVar ?
            <div>
              <Image
                src="/assets/create-project-illustration.svg"
                alt="utellme create project illustration"
                width={0}
                height={0}
                className="w-full px-10"
              />
            </div>
            :
            <div>
              <Image
                src="/assets/create-project-illustration-dark.svg"
                alt="utellme create project illustration"
                width={0}
                height={0}
                className="w-full px-10"
              />
            </div>
        }
      </StepsRow>
      <StepsRow i={3} title="Share the link / QR-Code">
        <Image
          src="/assets/utellme-mockup-03.png"
          alt="utellme main screen when you can share the link or the qr code"
          height={0}
          width={0}
          sizes="100vh"
          className="w-64"
        />
      </StepsRow>
      <StepsRow i={4} title="View your feedback">
        <Image
          src="/assets/utellme-mockup-01.png"
          alt="utellme view feedback page"
          height={0}
          width={0}
          sizes="100vh"
          className="w-64"
        />
      </StepsRow>
    </StepsRowContainer>
  )
}
const YourCustomerPov = () => {
  const isDarkModeVar = isDarkMode();
  return (
    <StepsRowContainer>
      <StepsRow i={1} title="Scan the QR-Code">
        {
          !isDarkModeVar ?
            <Image
              src="/assets/scan qr illustration.svg"
              alt="utellme scan qr illustration"
              height={0}
              width={0}
              className="w-full px-10"
            />
            :
            <Image
              src="/assets/scan qr illustration-dark.svg"
              alt="utellme scan qr illustration"
              height={0}
              width={0}
              className="w-full px-10"
            />
        }
      </StepsRow>
      <StepsRow i={2} title="Write the feedback">
        <Image
          src="/assets/utellme-mockup-02.png"
          alt="give feedback from utellme mockup"
          className="w-64 h-auto"
          height={0}
          width={0}
          sizes="100vh"
        />
      </StepsRow>
    </StepsRowContainer>
  )
}

const StepsRowContainer: React.FC<{
  children: React.ReactNode
}> = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {props.children}
    </div>
  )
}
const StepsRow: React.FC<{
  title: string;
  children: React.ReactNode;
  i: number;
}> = (props) => {
  const isOdd = props.i % 2 !== 0;
  const [windowWidth] = useWindowSize()
  const isSmall = (windowWidth || 0) < 768;
  const invert = isOdd && !isSmall;
  return (
    <>
      {
        invert &&
        <div className="relative m-auto">
          {props.children}
        </div>
      }
      <div className="flex items-center gap-2 m-auto flex-1">
        <div
          className="font-bold text-3xl md:text-4xl bg-primary w-11 md:w-14 aspect-square flex justify-center items-center rounded-full">
          <p className="text-slate-200">
            {props.i}
          </p>
        </div>
        <h3 className="font-semibold text-2xl md:text-3xl lg:text-3xl text-center">{props.title}</h3>
      </div>
      {
        !invert &&
        <div className="relative m-auto">
          {props.children}
        </div>
      }
    </>
  )
}

const FAQ = () => {
  return (
    <section className="px-6" id="faq">
      <div className="max-w-4xl m-auto">
        <h2 className="text-4xl font-bold text-center mb-6">FAQ</h2>
        <ul className="flex flex-col gap-1">
          <FaqQuestion
            question="How much is it going to cost?"
            answer="Nothing! Our service is completely free."
          />
          <FaqQuestion
            question="What type of projects is UTellMe good for?"
            answer="UTellMe is good for any type of project: work, speeches, school expositions, freelance jobs, local businesses etc."
          />
          <FaqQuestion
            question="What do I need feedback for?"
            answer="Feedback is one of the most important things in any project. It is the only way to know if you are doing something right or wrong and to improve yourself."
          />
          <FaqQuestion
            question="Why wouldn't I use something that is harder to configure but is going to ask more questions to my user?"
            answer="The main problem in getting feedback is actually getting it. If you are asking too many questions, you are going to lose your customer. We want to make it as easy as possible for your user to give you feedback, so that he gives sincere feedback without getting annoyed."
          />
          <FaqQuestion
            question="Who is going to see the feedback I receive?"
            answer="You are going to be able to see all the feedback you receive in your dashboard. No one else is going to be able to see it. The goal of UTellMe is to get feedback to improve, not to show others what your users think about your project."
          />
          <FaqQuestion
            question="Can I use UTellMe on mobile?"
            answer="UTellMe is fully responsive, so you, and your users, can use it on every device."
          />
          <FaqQuestion
            question="How can I share my projects to get feedback?"
            answer="You can use a link or a QR-Code that you can take from your project's dashboard."
          />
        </ul>
      </div>
    </section>
  )
}

const FaqQuestion: React.FC<{
  question: string;
  answer: string;
}> = (props) => {
  return (
    <li>
      <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          {props.question}
        </div>
        <div className="collapse-content">
          <p>{props.answer}</p>
        </div>
      </div>
    </li>
  )
}

export default Index;
