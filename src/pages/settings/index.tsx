import { getServerSession } from "next-auth/next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";

import { type GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/server/auth";
import { signOut, useSession } from "next-auth/react";
import { AvatarContent } from "~/components/Avatar";
import { BiCheck, BiLogOut, BiPencil } from "react-icons/bi";
import Input from "~/components/Input";
import LoadingIndicator from "~/components/LoadingIndicator";
import { api } from "~/utils/api";
import { reloadSession, toastTrpcError } from "~/utils/functions";
import { useWindowSize } from "~/utils/hooks";

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
  const [usernameValue, setUsernameValue] = useState("");
  const [hasUpdatedUsername, setHasUpdatedUsername] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isNewUsernameLoading, setIsNewUsernameLoading] = useState(false);
  const [usernameInitialLength, setUsernameInitialLength] = useState<number | undefined>(undefined);
  const { data, status } = useSession();

  const { mutate: updateName } = api.user.updateName.useMutation({
    onSuccess: () => {
      reloadSession();
      setTimeout(() => {
        //the timeout is to prevent the loading indicator from showing when the session isn't reloaded yet
        setIsNewUsernameLoading(false);
      }, 200)
    },

    onError: (e) => {
      setIsNewUsernameLoading(false);
      toastTrpcError(
        "Something went wrong changing your name. Please try again later.",
        e.data?.zodError?.fieldErrors,
        [{
          propertyName: "newName",
          propertyMessage: "New Name"
        }]
      )
    }
  });

  useEffect(() => {
    if (data?.user.name && !hasUpdatedUsername) {
      setUsernameValue(data.user.name);
      setHasUpdatedUsername(true);
      setUsernameInitialLength(data.user.name.length);
    }
  }, [data?.user.name, hasUpdatedUsername]);

  const handleUsernameChange = (value: string) => {
    if (value.length > 0) {
      setIsNewUsernameLoading(true);
      setIsEditingUsername(false);
      updateName({ newName: value });
    }
  };

  const usernameInputId = "username-input";
  const [windowWidth] = useWindowSize()
  const isSmall = (windowWidth || 0) < 768;

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="uTellMe settings" />
      </Head>
      {
        status === "loading" ?
          <div className="flex justify-center items-center h-screen">
            <LoadingIndicator />
          </div> :

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
                  <div className="flex flex-col grow">
                    <div className="flex items-center">
                      {
                        isNewUsernameLoading ? <LoadingIndicator isSmall /> :
                          isEditingUsername ?
                            <Input
                              id={usernameInputId}
                              name="username"
                              labelDisabled
                              onChange={(value) => {
                                setUsernameValue(value)
                              }}
                              placeholder="Username"
                              value={usernameValue}
                              borderHidden
                              initialLength={usernameInitialLength}
                              inputClassName="text-lg font-semibold h-min w-min"
                              maxLength={35}
                              onSubmit={(e) => {
                                handleUsernameChange(e.currentTarget.value);
                              }}
                              isGhost
                            /> : <p className="text-lg font-semibold">{data.user.name}</p>
                      }
                      {
                        isEditingUsername ?
                          <a
                            className={`${usernameValue.length ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={() => {
                              if (usernameValue.length) {
                                handleUsernameChange(usernameValue);
                              }
                            }}
                          >
                            <BiCheck size={22} className={usernameValue.length > 0 ? "text-success" : ""} />
                          </a>
                          :
                          <a className="cursor-pointer ml-1" onClick={() => {
                            setIsEditingUsername(true);
                            setTimeout(() => {
                              const input = document.getElementById(usernameInputId) as HTMLInputElement | null;
                              if (input) input.focus();
                            }, 100)
                          }}>
                            <BiPencil size={20} />
                          </a>
                      }
                    </div>
                    <p className="">{data.user.email}</p>
                  </div>
                }
                {
                  !isSmall ?
                    <AccountButtons />
                    :
                    <></>
                }
              </div>
              {
                isSmall ?
                  <AccountButtons isRow />
                  :
                  <></>
              }
            </div>
          </div>
      }
    </>
  );
};

const AccountButtons: React.FC<{
  isRow?: boolean;
}> = (props) => {
  return (
    <div className={`ml-auto ${props.isRow ? 'flex items-center gap-2' : 'flex flex-col gap-2'}`}>
      <SignoutButton isFull={!props.isRow} />
      <DeleteAccountButton />
    </div>
  )
}
const DeleteAccountButton: React.FC = () => {
  const { mutate: deleteAccount } = api.user.deleteAccount.useMutation({
    onError: (e) => {
      toastTrpcError(
        "Something went wrong deleting your account. Please try again later.",
        e.data?.zodError?.fieldErrors,
        []
      )
    },
    onSuccess: () => {
      void signOut();
    }
  });
  return (
    <button
      className="flex justify-between btn justify-self-end ml-auto flex-grow btn-error"
      onClick={() => {
        void deleteAccount();
      }}
    >
      delete account
    </button>
  )
}

export const SignoutButton: React.FC<{
  isFull?: boolean;
}> = (props) => {
  return (
    <button onClick={() => {
      void signOut();
    }} className={`flex justify-between btn justify-self-end ml-auto ${props.isFull ? 'w-full flex-grow' : ''}`}>
      <p>
        Sign Out
      </p>
      <BiLogOut size={20} />
    </button>
  );
}

export default IndexSettings;
