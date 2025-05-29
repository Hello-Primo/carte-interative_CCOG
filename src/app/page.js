"use client";
import dynamic from "next/dynamic";
const CarteInteractive = dynamic(() => import("./CarteInteractive"), {
  ssr: false,
});

export default function Home() {
  return <CarteInteractive />;
}
