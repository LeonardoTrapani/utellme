import { signIn } from "next-auth/react";
import React from "react";

const SignInPage = () => {
  void signIn();
  return <></>;
}
/*
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BsGithub } from "react-icons/bs";

const SignInPage = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="w-96 flex flex-col p-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold"><span>Tell</span> <span className="text-primary font-bold">Me!</span></h1>
        </div>
        <div className="flex flex-col gap-2">
          {Object.values(providers).map((provider) => {
            if (provider.id === 'google') return <GoogleProvider key={provider.name} provider={provider} />;
            if (provider.id === 'discord') return <DiscordProvider key={provider.name} provider={provider} />;
            if (provider.id === 'github') return <GithubProvider key={provider.name} provider={provider} />;
          })}
        </div>
      </div>
    </div>
  )
}

const GeneralProvider: React.FC<{
  provider: ClientSafeProvider;
  children: React.ReactNode;
  className?: string;
}> = (props) => {
  return (
    <button
      key={props.provider.name}
      className={`p-2 border border-current h-12 flex gap-2 items-center justify-center  ${props.className ?? ""}`}
      onClick={() => {
        void signIn(props.provider.id)
      }}>
      {props.children}
      <p>
        Continue with {props.provider.name}
      </p>
    </button>
  )
};

const GithubProvider: React.FC<{
  provider: ClientSafeProvider;
}> = (props) => {
  const iconSize = 24;
  return (
    <GeneralProvider provider={props.provider}>
      <BsGithub size={iconSize} />
    </GeneralProvider>
  )
};

const GoogleProvider: React.FC<{
  provider: ClientSafeProvider;
}> = (props) => {
  const iconSize = 24;
  return (
    <GeneralProvider provider={props.provider}>
      <FcGoogle size={iconSize} />
    </GeneralProvider>
  )
};

const DiscordProvider: React.FC<{
  provider: ClientSafeProvider;
}> = (props) => {
  const iconSize = 24;
  return (
    <GeneralProvider provider={props.provider}>
      <FaDiscord size={iconSize} />
    </GeneralProvider>
  )
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}

*/
export default SignInPage;
