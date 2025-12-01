"use client"
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

// dynamic import because Coverage is client-only (leaflet)
const Coverage = dynamic(() => import("@/components/Coverage/Coverage"), { ssr: false });

export default function Page() {
  const { status } = useSession();
  return (
    <main>
      {
        (status === "loading") ? <span className="loading loading-spinner  text-accent"></span> : <Coverage dataUrl="/data/coverageData.json" />
      }

    </main>
  );
}
