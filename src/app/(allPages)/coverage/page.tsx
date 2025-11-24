"use client"
import dynamic from "next/dynamic";

// dynamic import because Coverage is client-only (leaflet)
const Coverage = dynamic(() => import("@/components/Coverage/Coverage"), { ssr: false });

export default function Page() {
  return (
    <main>
      <Coverage dataUrl="/data/coverageData.json" />
    </main>
  );
}
