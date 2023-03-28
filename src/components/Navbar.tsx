import { signOut } from 'next-auth/react';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar flex justify-between bg-base-200">
      <a className="btn btn-ghost normal-case text-xl">Tell <span className='text-primary'>&nbsp;Me!</span></a>
      <div>
        <button
          className="btn btn-ghost"
          onClick={() => void signOut()}
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar;
