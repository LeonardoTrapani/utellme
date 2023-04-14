import React from "react";

import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { useRouter } from "next/router";
import { UTellMeComponent } from "~/components/UTellMeComponent";
import Head from "next/head";

const SignInPage = () => {
  const router = useRouter();
  const queryError = Array.isArray(router.query.error) ? router.query.error[0] : router.query.error;
  return (
    <>
      <Head>
        <title>Signin</title>
        <meta name="description" content="Signin to uTellMe" />
      </Head>
      <div className="flex h-screen w-full justify-center items-center">
        <div className="w-96 flex flex-col p-2">
          <div className={"text-center " + (!queryError ? "mb-6" : "")}>
            <UTellMeComponent isMedium />
          </div>
          <AuthErrorComponent error={queryError} />
          <div className="flex flex-col gap-2">
            <GithubProvider />
            <GoogleProvider />
          </div>
        </div>
      </div >
    </>
  )
}

const AuthErrorComponent: React.FC<{
  error: string | undefined;
}> = (props) => {
  if (!props.error) return <></>;
  let error = props.error;
  switch (props.error) {
    case "OAuthAccountNotLinked":
      error = "You already have an account with this email, please sign in with that account.";
      break;
    case "CredentialsSignin":
      error = "The credentials you provided are incorrect, please try again.";
    default:
      error = "There was an error signing in, please try again.";
      break;
  }

  return (
    <div className="text-center bg-error my-4 py-2">
      <p className="text-gray-800">{error}</p>
    </div>
  );
};

const GeneralProvider: React.FC<{
  providerId: string;
  providerName: string;
  children: React.ReactNode;
  className?: string;
}> = (props) => {
  return (
    <button
      key={props.providerName}
      className={`p-2 border border-current h-12 flex gap-2 items-center justify-center  ${props.className ?? ""}`}
      onClick={() => {
        void signIn(props.providerId)
      }}>
      {props.children}
      <p>
        Continue with {props.providerName}
      </p>
    </button>
  )
};

const GithubProvider: React.FC = () => {
  const iconSize = 24;
  return (
    <GeneralProvider providerName="GitHub" providerId="github">
      <BsGithub size={iconSize} />
    </GeneralProvider>
  )
};

const GoogleProvider: React.FC = () => {
  const iconSize = 24;
  return (
    <GeneralProvider providerName="Google" providerId="google">
      <FcGoogle size={iconSize} />
    </GeneralProvider>
  )
};

/*
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
*/

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  }
}

export default SignInPage;
