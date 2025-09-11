"use client";

import { useState, type InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export default function FloatingInput({
  label,
  id,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(props.defaultValue || props.value || "");

  const isFloating = isFocused || value.toString().length > 0;

  const inputProps = { ...props };
  if (!isFloating && inputProps.placeholder) {
    delete inputProps.placeholder;
  }

  return (
    <div
      className={`border transition-all duration-150 rounded-[16px] relative ${
        isFloating ? "border-black border-2" : "border-gray-300"
      }`}
    >
      <label
        htmlFor={id}
        className={`absolute transition-all duration-150 pointer-events-none ${
          isFloating
            ? "text-xs top-2 left-4 text-black"
            : "text-gray-500 top-3.5 left-4"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        value={props.value !== undefined ? props.value : value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange?.(e);
        }}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`w-full bg-transparent border-0 focus:ring-0 focus:outline-none rounded-[16px] ${
          isFloating ? "pt-6 pb-2" : "pt-3 pb-3"
        } px-4 text-black`}
      />
    </div>
  );
}
