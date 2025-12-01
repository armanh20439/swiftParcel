"use client";

import { signOut, useSession } from "next-auth/react";
import Link from 'next/link'
import React from 'react'
import BrandLogo from '../Logo/BrandLogo'

const Navbar = () => {
    const { data: session, status } = useSession();

    const navItem = <>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About Us</Link></li>
        <li><Link href="/coverage">Coverage</Link></li>
        <li><Link href="/sendParcel">Send A Parcel</Link></li>
        {
            session?.user?.email&&<li><Link href="/dashboard">Dashboard</Link></li>
        }


    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navItem}
                    </ul>
                </div>
                <div className="btn btn-ghost text-xl"><BrandLogo></BrandLogo></div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItem}
                </ul>
            </div >
            <div className="navbar-end">
                {
                    (status === "loading") ? <span className="loading loading-infinity loading-xl"></span> : <div className="navbar-end">
                        {
                            session?.user?.email ? <Link href={"/"} onClick={() => signOut()} className="btn btn-primary text-black">Log Out</Link> : <Link href={"/login"} className="btn btn-primary text-black">Log In</Link>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar