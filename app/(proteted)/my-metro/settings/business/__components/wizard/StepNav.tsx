"use client";

import React from "react";

interface Props {
  steps: { id: string; title: string }[];
  currentIndex: number;
  onJump: (index: number) => void;
}

export default function StepNav({ steps, currentIndex, onJump }: Props) {
  return (
    <nav className="flex gap-2 items-center overflow-auto mb-4">
      {steps.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(i)}
          className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
            i === currentIndex ? "bg-black text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {s.title}
        </button>
      ))}
    </nav>
  );
}
