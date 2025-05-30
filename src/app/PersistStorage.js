"use client";
import { useEffect } from "react";

export default function PersistStorage() {
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.storage?.persist) {
      navigator.storage.persist().then((granted) => {
        if (granted) {
          console.log(
            "Stockage persistant accordé : les tuiles et le cache seront moins susceptibles d'être effacés."
          );
        } else {
          console.log("Stockage persistant refusé ou non supporté.");
        }
      });
    }
  }, []);
  return null;
}
