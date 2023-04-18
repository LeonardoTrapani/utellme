import { getServerSession } from "next-auth/next";
import Head from "next/head";
import React from "react";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";

import { type GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { signOut, useSession } from "next-auth/react";
import { AvatarContent } from "~/components/Avatar";
import { BiLogOut } from "react-icons/bi";
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth/signin" } };
  }
  return {
    props: {}
  };
}

const IndexSettings = () => {
  const { data } = useSession();
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="uTellMe settings" />
      </Head>
      <div className="max-w-3xl m-auto p-2">
        <div className="flex items-center">
          <UTellMeComponentButton />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="divider my-1" />
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-2">Account & Sign-in</h2>
          <div className="flex items-center gap-4 mb-4 w-full">
            <AvatarContent isBig sessionData={data} />
            {
              data?.user.name &&
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{data.user.name}</p>
                <p className="">{data.user.email}</p>
              </div>
            }
            <a onClick={() => {
              void signOut();
            }} className="flex justify-between btn justify-self-end ml-auto">
              <p>
                Sign Out
              </p>
              <BiLogOut size={20} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexSettings;
