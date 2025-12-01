"use client";

import { useSession } from "next-auth/react";
import SendParcelForm from "@/components/SendParcelForm/SendParcelForm";
import { redirect } from "next/navigation";

const SendParcel = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <span className="loading loading-spinner text-accent"></span>;

  if (!session) {
    redirect(`/login?callbackUrl=/sendParcel`);
  }

  return <SendParcelForm />;
};

export default SendParcel;
