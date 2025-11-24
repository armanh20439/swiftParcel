"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    redirect("/login");
  }

  return <UserInfo />;
};

export default Dashboard;
