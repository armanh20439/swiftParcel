"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import BrandLogo from "../Logo/BrandLogo";

const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user?.email;
  const isUser = session?.user?.role === "user";

  const navItems = (
    <>
      {/* Public */}
      {!isLoggedIn && (
        <>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About Us</Link></li>
        </>
      )}

      {/* Public + User */}
      {(!isLoggedIn || isUser) && (
        <>
          <li><Link href="/coverage">Coverage</Link></li>
          <li><Link href="/sendParcel">Send A Parcel</Link></li>
        </>
      )}

      {/* Logged-in User only */}
      {isLoggedIn && isUser && (
        <li><Link href="/be-a-rider">Be A Rider</Link></li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Left */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>

        
          <BrandLogo />
       
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end">
        {status === "loading" ? (
          <span className="loading loading-infinity loading-md"></span>
        ) : (
          <>
            {isLoggedIn && (
              <Link href="/dashboard" className="mr-3">
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => signOut()}
                className="btn btn-primary text-black"
              >
                Log Out
              </button>
            ) : (
              <Link href="/login" className="btn btn-primary text-black">
                Log In
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
