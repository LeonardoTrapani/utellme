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
import Modal, { OpenModalButton } from "~/components/Modal";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

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
  const deleteAccountModalId = "delete-account-modal";
  const { status } = useSession();
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="UTellMe settings" />
      </Head>
      {
        status === "loading" ?
          <div className="flex justify-center items-center h-screen">
            <LoadingIndicator />
          </div> :
          <>
            <div className="max-w-3xl m-auto p-2 flex flex-col gap-6">
              <div className="flex items-center gap-2 m-auto">
                <UTellMeComponentButton />
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
              <AccountAndSigninComponent />
              <UTellMeMembershipComponent />
              <DeleteAccountComponent modalId={deleteAccountModalId} />
            </div>
            <DeleteAccountModal modalId={deleteAccountModalId} />
          </>
      }
    </>
  );
};

const DeleteAccountModal: React.FC<{
  modalId: string;
}> = (props) => {
  const [deleteMyAccountValue, setDeleteMyAccountValue] = useState("");
  const [deleteMyAccountHasError, setDeleteMyAccountHasError] = useState(false);

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

  const deleteAccountHandler = (value: string) => {
    if (value === "delete my account") {
      void deleteAccount();
      setDeleteMyAccountHasError(false);
      return;
    }
    setDeleteMyAccountHasError(true);
  };

  return (
    <Modal id={props.modalId}>
      <div>
        <h1 className="text-2xl font-bold">Are you sure you want to delete your account?</h1>
        <div className="divider my-0" />
        <p>This action cannot be undone. You will <span className="font-semibold">immediately lose all your projects</span> along with all your feedback. If you have any problems please <Link href="mailto:support@utellme.app" className="link link-hover">contact us</Link></p>
        <div className="py-6 flex flex-col gap-2">
          <p>To verify, type <span className="italic">delete my account</span> below:</p>
          <Input
            labelDisabled
            placeholder='delete my account'
            value={deleteMyAccountValue}
            onSubmit={(e) => {
              deleteAccountHandler(e.currentTarget.value);
            }}
            name="Verify"
            onChange={(value) => {
              setDeleteMyAccountValue(value);
            }}
            isError={deleteMyAccountHasError}
          />
        </div>
        <button
          className="btn btn-error m-auto flex"
          onClick={() => {
            deleteAccountHandler(deleteMyAccountValue);
          }}
        >
          delete account
        </button>
      </div>
    </Modal>
  )
}

const AccountAndSigninComponent: React.FC = () => {
  const [usernameValue, setUsernameValue] = useState("");
  const [hasUpdatedUsername, setHasUpdatedUsername] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isNewUsernameLoading, setIsNewUsernameLoading] = useState(false);
  const [usernameInitialLength, setUsernameInitialLength] = useState<number | undefined>(undefined);
  const { data } = useSession();

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

    <div className="flex flex-col items-start">
      <h2 className="text-2xl font-bold mb-2">Account & Sign-in</h2>
      <div className="divider my-0" />
      <div className="flex items-center gap-2 mb-4 w-full">
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
                  <a
                    className="cursor-pointer ml-1"
                    onClick={() => {
                      setIsEditingUsername(true);
                      setTimeout(() => {
                        const input = document.getElementById(usernameInputId) as HTMLInputElement | null;
                        if (input) input.focus();
                      }, 100)
                    }}
                  >
                    <BiPencil size={20} />
                  </a>
              }
            </div>
            <p className="">{data.user.email}</p>
          </div>
        }
        {
          !isSmall ?
            <SignoutButton />
            :
            <></>
        }
      </div>
      {
        isSmall ?
          <SignoutButton />
          :
          <></>
      }
    </div>
  )
};

const DeleteAccountComponent: React.FC<{
  modalId: string;
}> = (props) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl text-error font-bold">Delete account</h2>
      <div className="divider my-0" />
      <p className="mb-4">Once you delete your account, there is no going back. Please be certain.</p>
      <OpenModalButton id={props.modalId}>
        <div className="btn btn-error">Delete Account</div>
      </OpenModalButton>
    </div>
  )
}

const UTellMeMembershipComponent = () => {
  const { mutate: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation({
    onError: (e) => {
      if (e.message) return toast.error(e.message);

      toastTrpcError(
        "Something went wrong creating your checkout session. Please try again later.",
        e.data?.zodError?.fieldErrors,
        []
      )
    },
    onSuccess: ({ checkoutUrl }) => {
      if (checkoutUrl) {
        void push(checkoutUrl);
      }
    }
  });
  const { mutate: createBillingPortalSession } = api.stripe.createBillingPortalSession.useMutation({
    onError: (e) => {
      toastTrpcError(
        "Something went wrong creating your checkout session. Please try again later.",
        e.data?.zodError?.fieldErrors,
        []
      )
    },
    onSuccess: ({ billingPortalUrl }) => {
      if (billingPortalUrl) {
        void push(billingPortalUrl);
      }
    }
  });

  const { push } = useRouter();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Membership</h2>
      <div className="divider my-0" />
      <p className="mb-4">
        You are currently using the free tier version of UTellMe!&nbsp;
        <Link href={"/subscription"} className="link link-primary">
          Click here
        </Link> to discover more about subscriptions
      </p>
      <div className="btn-group">
        <button className="btn" onClick={() => createCheckoutSession()}>Upgrade account</button>
        <button className="btn" onClick={() => createBillingPortalSession()}>Manage Billing</button>
      </div>

    </div>

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
