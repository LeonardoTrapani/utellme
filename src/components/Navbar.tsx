import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { UTellMeComponentButton } from './UTellMeComponent';

const Navbar: React.FC = () => {
  const { status } = useSession();

  return (
    <nav className="navbar flex justify-between bg-base-200">
      <UTellMeComponentButton hasText />
      <div>
        {
          status === 'authenticated' ?
            <button
              className="btn btn-ghost"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
            :
            <Link href="/auth/signin">
              <div className='btn btn-ghost'>
                Sign In
              </div>
            </Link>
        }
      </div>
    </nav>
  )
}

export default Navbar;
