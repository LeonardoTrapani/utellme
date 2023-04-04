import { signIn } from 'next-auth/react';
import React from 'react';
import { TellMeComponent } from '~/components/TellMeComponent';

const LoginPage: React.FC = () => {
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
