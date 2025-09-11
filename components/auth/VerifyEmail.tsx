"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/floating-input";
import { useAppDispatch, useAppSelector } from "@/redux";
import { signIn } from "next-auth/react";

export default function VerifyEmailCard() {
  const router = useRouter();
  const loginState = useAppSelector((state) => state.login.loginState);
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!code) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        login_token: loginState.login_token,
        otp: code,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        setIsVerified(true);
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="px-6 pb-6 pt-12">
        <div className="flex w-full items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 p-2 text-white shadow-sm">
            <span className="text-xl font-bold">M</span>
          </div>
          <span className="text-3xl font-bold text-black">Metro</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8">
          {isVerifying ? (
            <div className="space-y-6 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-500" />
              <p className="text-lg font-semibold text-black">Verifying...</p>
            </div>
          ) : isVerified ? (
            <div className="space-y-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="text-2xl font-bold text-black">Verification Successful!</h1>
              <p className="text-gray-600">Redirecting you shortly...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-black">
                  Enter the code sent to your email
                </h1>
                <p className="text-gray-600">
                  We sent the code to your email address.
                </p>

                <div className="flex items-center gap-2 text-black">
                  <HelpCircle className="h-5 w-5" />
                  <Link href="#" className="font-medium hover:underline">
                    Get help
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  id="code"
                  type="text"
                  label="Confirmation code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                />

                {error && (
                  <div className="py-2 text-center text-sm text-red-500">
                    {error}
                  </div>
                )}

                <Button
                  className="mt-4 w-full rounded-[16px] bg-black py-6 font-medium text-white hover:bg-gray-900"
                  onClick={handleContinue}
                  disabled={isVerifying || !code}
                >
                  {isVerifying ? "Verifying..." : "Continue"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
