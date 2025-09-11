"use client";

import FloatingInput from "../floating-input";
import Link from "next/link";
import { MessageCircleQuestionIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateRegisterState } from "@/redux/feature/authentication";
import api from "@/redux/helper/axios";

type RegisterOTPResponse = {
  success: boolean;
  message: string;
  data: {
    email: string | null;
    phone: string | null;
    token: string;
  };
};

const Step2Signup = () => {
  const registerState = useAppSelector((state) => state.register.registerState);
  const dispatch = useAppDispatch();
  const [codeOtp, setCodeOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    try {
      setError(null);
      const response = await api.post<RegisterOTPResponse>(
        "auth/register-otp",
        {
          email: registerState.email,
          phone: registerState.phone,
          countryCode: registerState.countryCode,
          otp: codeOtp,
          register_token: registerState.register_token,
        }
      );

      if (response.data.success) {
        dispatch(updateRegisterState({key: "register_token", value: response.data.data.token}));
        dispatch(updateRegisterState({key: "registerStep", value: 3}));
      } else {
        setError(response.data.message || "Invalid confirmation code");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Step 2 of 4</span>
          <span>Account Details</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full"
            style={{ width: "50%" }}
          ></div>
        </div>
      </div>

      <div className="space-y-2 w-full max-w-md text-black">
        <h1 className="text-2xl font-semibold">
          Enter the code sent to your phone
        </h1>
        <p className="text-gray-600">
          We sent the code to {registerState.phone || registerState.email}.
        </p>

        <div className="flex items-center gap-2 text-black">
          <MessageCircleQuestionIcon className="h-5 w-5" />
          <Link href="#" className="font-medium hover:underline">
            Get help
          </Link>
        </div>
      </div>

      <div className="space-y-4 my-8 w-full max-w-md">
        <FloatingInput
          id="code"
          type="text"
          label="Confirmation code"
          value={codeOtp}
          onChange={(e) => setCodeOtp(e.target.value)}
          maxLength={6}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full rounded-[16px] bg-black hover:bg-gray-900 py-6 font-medium text-white mt-4"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </>
  );
};

export default Step2Signup;
