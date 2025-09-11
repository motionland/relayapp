"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/floating-input";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateRegisterState } from "@/redux/feature/authentication";
import PhoneInput from "../ui/phone-input";
import api from "@/redux/helper/axios";

interface RegisterEmailResponse {
  success: boolean;
  message: string;
  data: {
    register_token: string;
  };
}

export default function Step1Signup() {
  const registerState = useAppSelector((state) => state.register.registerState);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    // Prepare payload based on mode
    const payload = registerState.isEmailMode
      ? { email: registerState.email, phone: null, countryCode: null }
      : {
          email: null,
          phone: registerState.phone,
          countryCode: registerState.countryCode,
        };

    try {
      const response = await api.post<RegisterEmailResponse>(
        "auth/register-email",
        payload
      );

      if (response.data.success) {
        dispatch(updateRegisterState({key: "register_token", value: response.data.data.register_token}));
        dispatch(updateRegisterState({key: "registerStep", value: 2}));
      }
    } catch (err) {
      // router.push("/verify?flow=create");
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Step 1 of 4</span>
          <span>Account Details</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: "25%" }}
          ></div>
        </div>
      </div>

      <div className="space-y-1 w-full max-w-md mb-8">
        <h1 className="text-2xl font-semibold text-black">Create an account</h1>
        <p className="text-gray-600 text-sm">
          To create an account, enter your phone number or email address.
          Already have an account?{" "}
          <Link href="/" className="text-black hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <div>
          {registerState.isEmailMode ? (
            <FloatingInput
              id="email"
              type="email"
              label="Email address"
              placeholder="name@example.com"
              value={registerState.email || ""}
              onChange={(e) => dispatch(updateRegisterState({key: "email", value: e.target.value}))}
            />
          ) : (
            <PhoneInput />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-[24px] bg-white hover:bg-gray-50 border-black py-6 font-medium text-black"
            onClick={() => {
              dispatch(updateRegisterState({key: "isEmailMode", value: !registerState.isEmailMode}));
              dispatch(updateRegisterState({key: "email", value: ""}));
              dispatch(updateRegisterState({key: "phone", value: ""}));
              dispatch(updateRegisterState({key: "countryCode", value: ""}));
              setError("");
            }}
          >
            Use {registerState.isEmailMode ? "phone" : "email"}
          </Button>
          <Button
            className="flex-1 rounded-[24px] bg-black hover:bg-gray-900 py-6 font-medium text-white"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (!registerState.email && registerState.isEmailMode) ||
              (!registerState.phone && !registerState.isEmailMode)
            }
          >
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 pt-1">
          By entering and clicking Continue, you agree to the{" "}
          <Link
            href="#"
            className="underline font-medium text-gray-700 hover:text-black"
          >
            Terms
          </Link>
          ,{" "}
          <Link
            href="#"
            className="underline font-medium text-gray-700 hover:text-black"
          >
            E-Sign Consent
          </Link>{" "}
          &{" "}
          <Link
            href="#"
            className="underline font-medium text-gray-700 hover:text-black"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
