"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";

const userDetails = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <span className="loading loading-spinner text-accent"></span>;

  if (!session) {
    redirect(`/login?callbackUrl=/userDetails`);
  }

  return <UserInfo />;
};

export default userDetails;
