// StepWrapper.tsx (hash two-way sync)
"use client";

import React, { useEffect } from "react";

export type Step = { id: string; title: string; icon?: React.ComponentType<any> };

interface Props {
  steps: Step[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  children: React.ReactNode;
}

export default function StepWrapper({ steps, currentIndex, setCurrentIndex, children }: Props) {
  // saat mount dan saat hash berubah manual -> update currentIndex
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "");
      const idx = steps.findIndex((s) => s.id === hash);
      if (idx >= 0 && idx !== currentIndex) {
        setCurrentIndex(idx);
      }
    }

    // initial sync
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [steps, setCurrentIndex, currentIndex]);

  // saat step berubah -> update URL hash
  useEffect(() => {
    const id = steps[currentIndex]?.id;
    if (!id) return;

    // gunakan replaceState supaya tidak menumpuk history
    const newUrl = `${window.location.pathname}#${id}`;
    window.history.replaceState(undefined, "", newUrl);
    // Jika kamu mau memicu 'hashchange' event supaya listener lainnya juga bereaksi,
    // kamu bisa juga set location.hash = `#${id}` (tapi itu menambah history entry).
  }, [currentIndex, steps]);

  return <div>{children}</div>;
}
