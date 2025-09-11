"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Smartphone, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateLoginState } from "@/redux/feature/authentication";

interface AuthOption {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  disabled: boolean;
  action: () => void;
}

interface LoginResponseData {
  success: boolean;
  message: string;
  data: {
    login_token?: string;
    token_login?: string;
  };
}

export default function AuthOptionsCard() {
  const router = useRouter();
  const loginState = useAppSelector((state) => state.login.loginState);
  const dispatch = useAppDispatch();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [loadingOptionId, setLoadingOptionId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const userEmail = loginState.email;
  const isPhoneVerified = false;
  const isDeviceVerified = false;

  const sendMagicLink = async () => {
    setLoadingOptionId("email-magic");
    setStatusMessage(null);
    setIsError(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/magic-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            type: "email",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Failed to send magic link";
        throw new Error(errorMessage);
      }

      setStatusMessage("Magic link sent to your email");
    } catch (error) {
      console.error("Magic Link Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to process your request at this time. Please try again later.";
      setStatusMessage(errorMessage);
      setIsError(true);
    } finally {
      setLoadingOptionId(null);
    }
  };

  const sendLoginOtp = async () => {
    setLoadingOptionId("email-otp");
    setStatusMessage(null);
    setIsError(false);

    try {
      // Step 1: Request login token
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            phone: null,
            countryCode: null,
          }),
        }
      );

      const loginData = (await loginResponse.json()) as LoginResponseData;

      if (!loginResponse.ok) {
        const errorMessage = loginData.message || "Failed to initiate login";
        throw new Error(
          errorMessage === "User not found"
            ? "We couldn't find an account with this email address"
            : errorMessage
        );
      }

      const loginToken =
        loginData.data.token_login || loginData.data.login_token;
      if (!loginToken) {
        throw new Error("Authentication token not received");
      }

      // Step 2: Send OTP using the login token
      const otpResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-sendotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            login_token: loginToken,
          }),
        }
      );

      const otpData = (await otpResponse.json()) as LoginResponseData;
      console.log({ otpData });

      if (!otpResponse.ok) {
        const errorMessage = otpData.message || "Failed to send OTP";
        throw new Error(errorMessage);
      }

      setStatusMessage("OTP sent to your email");
      const tokenToStore = otpData.data.login_token || loginToken;
      dispatch(updateLoginState({ key: "login_token", value: tokenToStore }));
      router.push(`/auth/verify-email`);
    } catch (error) {
      console.error("Login OTP Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to process your request at this time. Please try again later.";
      setStatusMessage(errorMessage);
      setIsError(true);
    } finally {
      setLoadingOptionId(null);
    }
  };

  const authOptions: AuthOption[] = [
    {
      id: "password",
      icon: Lock,
      title: "Password",
      description: "Device not verified",
      disabled: !isDeviceVerified,
      action: () => {
        // Logic for password authentication
      },
    },
    {
      id: "email-otp",
      icon: Mail,
      title: "Email verification code",
      description: `Code sent to ${userEmail}`,
      disabled: !userEmail,
      action: sendLoginOtp,
    },
    {
      id: "email-magic",
      icon: Mail,
      title: "Email magic link",
      description: `Link sent to ${userEmail}`,
      disabled: !userEmail,
      action: sendMagicLink,
    },
    {
      id: "sms-otp",
      icon: Smartphone,
      title: "SMS verification code",
      description: "Phone number not verified",
      disabled: !isPhoneVerified,
      action: () => {
        // Logic for SMS OTP verification
      },
    },
    {
      id: "phone-magic",
      icon: Smartphone,
      title: "Phone magic link",
      description: "Phone number not verified",
      disabled: !isPhoneVerified,
      action: () => {
        // Logic for phone magic link
      },
    },
  ];

  const handleAuthOptionSelect = (option: AuthOption) => {
    if (option.disabled || loadingOptionId) return;
    setSelectedOptionId(option.id);
    option.action();
  };

  const navigateToLogin = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 pt-12 pb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-orange-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-3xl text-black">Metro</span>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-sm mx-auto space-y-10">
          <div className="text-center space-y-3 text-black">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify your identity
            </h1>
            <p className="text-gray-500">
              Select a verification method to continue
            </p>

            {statusMessage && isError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-left">{statusMessage}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {authOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleAuthOptionSelect(option)}
                disabled={option.disabled || loadingOptionId === option.id}
                className={cn(
                  "w-full max-w-md h-16 rounded-xl text-left transition-all flex items-center gap-4 border border-gray-200",
                  option.disabled
                    ? "bg-gray-50 cursor-not-allowed opacity-70"
                    : loadingOptionId === option.id
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-white hover:border-gray-300 hover:shadow-sm active:bg-gray-50"
                )}
                variant="ghost"
              >
                <div
                  className={`p-2.5 rounded-lg ${
                    option.disabled ? "bg-gray-100" : "bg-blue-50"
                  }`}
                >
                  {loadingOptionId === option.id ? (
                    <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <option.icon
                      className={`w-5 h-5 ${
                        option.disabled ? "text-gray-400" : "text-blue-600"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      option.disabled ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {option.title}
                  </div>
                  <div
                    className={`text-sm mt-0.5 ${
                      option.disabled ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {statusMessage && !isError && (
            <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-800 flex items-center">
              <p className="text-sm font-medium">{statusMessage}</p>
            </div>
          )}

          <Button
            onClick={navigateToLogin}
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-50 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to login</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
