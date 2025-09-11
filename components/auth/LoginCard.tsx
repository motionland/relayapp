"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateLoginState } from "@/redux/feature/authentication/loginSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingInput from "../floating-input";
import PhoneInput from "../ui/phone-input";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loginState = useAppSelector((state) => state.login.loginState);

  const handleLogin = async () => {
    if (loginState.isEmailMode && loginState.email) {
      dispatch(updateLoginState({ key: "email", value: loginState.email }));
      router.push(`/auth/options`);
    } else if (!loginState.isEmailMode && loginState.phone) {
      dispatch(updateLoginState({ key: "phone", value: loginState.phone }));
      router.push("/auth/options");
    }
  };

  const handleInputChange = (field: "email" | "phone", value: string) => {
    dispatch(updateLoginState({ key: field, value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="px-6 pb-6 pt-12">
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="bg-orange-500 text-white p-2 rounded-full shadow-sm flex items-center justify-center w-10 h-10">
            <span className="font-bold text-xl">M</span>
          </div>
          <span className="font-bold text-3xl text-black">Metro</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-center">Log in</h1>
            <p className="text-gray-600 text-center">
              Enter your phone number or email. New to Metro?{" "}
              <Link
                href="/auth/signup"
                className="text-black hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              {loginState.isEmailMode ? (
                <FloatingInput
                  id="email"
                  type="email"
                  label="Email address"
                  value={loginState.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <PhoneInput />
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-[16px] bg-white hover:bg-gray-50 border-black py-6 font-medium text-black"
                onClick={() =>
                  dispatch(updateLoginState({ key: "isEmailMode", value: !loginState.isEmailMode }))
                }
              >
                Use {loginState.isEmailMode ? "phone" : "email"}
              </Button>

              <Button
                onClick={handleLogin}
                className="flex-1 rounded-[16px] bg-black hover:bg-gray-900 py-6 font-medium text-white"
                disabled={loginState.isEmailMode && !loginState.email}
              >
                Continue
              </Button>
            </div>

            <p className="text-xs text-gray-500 pt-1">
              By entering and clicking Continue, you agree to the{" "}
              <Link href="#" className="underline hover:text-black">
                Terms
              </Link>
              ,{" "}
              <Link href="#" className="underline hover:text-black">
                E-Sign Consent
              </Link>{" "}
              &{" "}
              <Link href="#" className="underline hover:text-black">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 text-xs text-gray-500 max-w-md space-y-4">
          <p>
            Metro is a logistics and package management platform operated by
            Metro Texas LLC. Metro is not a carrier. Delivery and transportation
            services are fulfilled by Metro&apos;s independent partner network.
          </p>
          <p>
            Metro Texas LLC does not directly transport packages or offer
            insurance. Any insurance or loss coverage is provided by third-party
            vendors.
          </p>
          <p>
            Customs handling and international shipments may involve additional
            third-party services and are subject to their respective terms.
          </p>
          <p>
            For more information, please review our{" "}
            <Link href="#" className="underline hover:text-black">
              Disclosures
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
