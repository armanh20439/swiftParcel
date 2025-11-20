"use client";

 import { signOut, useSession } from "next-auth/react";
const UserInfo = () => {
   
 const { data: session } = useSession();
  return (
    <div>
      <div className="p-4">
      <p>Name: {session?.user?.name || "No name found"}</p>
      <p>Email: {session?.user?.email || "No email found"}</p>

      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white font-bold px-4 py-2 mt-4 rounded"
      >
        Log Out
      </button>
    </div>
    </div>
  )
}

export default UserInfo
