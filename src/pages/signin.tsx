import { signIn, useSession } from 'next-auth/react';
import React from 'react';
import { TellMeComponent } from '~/components/TellMeComponent';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === 'loading') {
    return <></>;
  }
  if (status === 'authenticated') {
    void router.push('/')
    return <></>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <TellMeComponent />
      <button
        className="btn"
        onClick={() => void signIn()}
      >
        Sign In
      </button>
    </div>
  );
};

export default LoginPage;
