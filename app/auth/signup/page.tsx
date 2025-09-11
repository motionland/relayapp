"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux";
import Step1Signup from "@/components/auth/Step1Signup";
import Step2Signup from "@/components/auth/Step2Signup";
import Step3Signup from "@/components/auth/Step3Signup";
import Step4Signup from "@/components/auth/Step4Signup";

export default function CreateAccountPage() {
  const registerState = useAppSelector((state) => state.register.registerState);

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
        {registerState.registerStep === 1 && <Step1Signup />}
        {registerState.registerStep === 2 && <Step2Signup />}
        {registerState.registerStep === 3 && <Step3Signup />}
        {registerState.registerStep === 4 && <Step4Signup />}

        <div className="mt-10 text-xs text-gray-500 max-w-md space-y-4">
          <p>
            Metro is a logistics and package management platform operated by
            Metro Texas LLC. Metro is not a carrier. Delivery and transportation
            services are fulfilled by Metro's independent partner network.
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
