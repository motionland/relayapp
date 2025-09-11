"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux";
import { updateRegisterState } from "@/redux/feature/authentication";
import api from "@/redux/helper/axios";

interface RegisterUserResponse {
  success: boolean;
  message: string;
  data?: any;
}

const Step4Signup = () => {
  const registerState = useAppSelector((state) => state.register.registerState);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [passcodeDigits, setPasscodeDigits] = useState(["", "", "", ""]);
  const [confirmPasscodeDigits, setConfirmPasscodeDigits] = useState([
    "",
    "",
    "",
    "",
  ]);
  const passcodeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const confirmPasscodeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const passcode = passcodeDigits.join("");
    const confirmPasscode = confirmPasscodeDigits.join("");
    dispatch(updateRegisterState({ key: "passcode", value: passcode }));
    dispatch(
      updateRegisterState({ key: "confirm_passcode", value: confirmPasscode })
    );
  }, [passcodeDigits, confirmPasscodeDigits]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes inputFocus {
        0% { transform: scale(1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        50% { transform: scale(1.05); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        100% { transform: scale(1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePasscodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newDigits = [...passcodeDigits];
    newDigits[index] = value;
    setPasscodeDigits(newDigits);

    // Auto-focus next input
    if (value && index < 3) {
      passcodeRefs[index + 1].current?.focus();
    }
  };

  const handleConfirmPasscodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newDigits = [...confirmPasscodeDigits];
    newDigits[index] = value;
    setConfirmPasscodeDigits(newDigits);

    // Auto-focus next input
    if (value && index < 3) {
      confirmPasscodeRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean = false
  ) => {
    const refs = isConfirm ? confirmPasscodeRefs : passcodeRefs;
    const digits = isConfirm ? confirmPasscodeDigits : passcodeDigits;

    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleContinue = async () => {
    try {
      setError(null);
      const passcode = passcodeDigits.join("");
      const confirmPasscode = confirmPasscodeDigits.join("");

      // Validate passcode
      if (passcode.length !== 4) {
        setError("Passcode must be 4 digits long");
        return;
      }

      if (passcode !== confirmPasscode) {
        setError("Passcodes don't match. Please try again.");
        return;
      }

      const response = await api.post<RegisterUserResponse>(
        "auth/register-user",
        {
          email: registerState.email,
          phone: registerState.phone,
          countryCode: registerState.countryCode,
          full_name: registerState.full_name,
          password: registerState.password,
          code: passcode,
          register_token: registerState.register_token,
          password_confirmation: registerState.password,
        }
      );

      if (response.data.success) {
        router.push("/auth/login");
      } else {
        setError(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Step 4 of 4</span>
          <span>Set Passcode</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>

      <div className="space-y-1 w-full max-w-md text-black">
        <h1 className="text-2xl font-semibold">Set your passcode</h1>
        <p className="text-gray-600 text-sm">
          Enter a 4-digit passcode for your account.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        <div className="space-y-4">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Enter your 5-digit passcode
            </label>
            <div className="flex justify-center space-x-3">
              {passcodeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={passcodeRefs[index]}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePasscodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="text-black w-12 h-14 text-2xl text-center font-bold border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Confirm your passcode
            </label>
            <div className="flex justify-center space-x-3">
              {confirmPasscodeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={confirmPasscodeRefs[index]}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleConfirmPasscodeChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e, true)}
                  className="text-black w-12 h-14 text-2xl text-center font-bold border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Error messages */}
        {passcodeDigits.join("") !== confirmPasscodeDigits.join("") &&
          confirmPasscodeDigits.some((digit) => digit !== "") && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-red-600 text-sm font-medium">
                Passcodes don't match. Please try again.
              </p>
            </div>
          )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Continue button */}
        <Button
          className="w-full rounded-xl py-6 font-medium text-white shadow-sm transition-all duration-200 mt-4"
          onClick={handleContinue}
          disabled={
            passcodeDigits.some((digit) => digit === "") ||
            confirmPasscodeDigits.some((digit) => digit === "") ||
            passcodeDigits.join("") !== confirmPasscodeDigits.join("")
          }
        >
          Create Account
        </Button>
      </div>
    </>
  );
};

export default Step4Signup;
