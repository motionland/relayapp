"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, Sparkles } from "lucide-react";

interface Props {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: Props) {
  return (
    <div className="text-center space-y-8 py-8">
      {/* Building illustration */}
      <div className="mx-auto w-32 h-24 relative">
        <svg viewBox="0 0 128 96" className="w-full h-full">
          <rect x="20" y="40" width="88" height="56" fill="white" stroke="black" strokeWidth="2" />
          <polygon points="16,40 64,16 112,40" fill="#22c55e" stroke="black" strokeWidth="2" />
          <ellipse cx="45" cy="70" rx="8" ry="15" fill="white" stroke="black" strokeWidth="1.5" />
          <circle cx="48" cy="70" r="1.5" fill="#22c55e" />
          <rect x="65" y="50" width="12" height="12" fill="white" stroke="black" strokeWidth="1" />
          <rect x="85" y="50" width="12" height="12" fill="white" stroke="black" strokeWidth="1" />
          <rect x="85" y="75" width="16" height="12" fill="#22c55e" stroke="black" strokeWidth="1.5" />
          <rect x="87" y="77" width="4" height="8" fill="white" />
          <circle cx="25" cy="80" r="8" fill="black" />
          <text x="25" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            $
          </text>
        </svg>
      </div>

      <div>
        <p className="text-gray-500 text-sm mb-2">Metro Business</p>
        <h1 className="text-3xl font-bold text-black mb-4">Streamline your business management</h1>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Accept packages securely, track deliveries, and manage your business correspondence—right from your phone.
          Professional service, simplified.
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <div className="flex items-start gap-3 text-left">
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
            <Building2 className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="font-medium text-black">Secure package handling</p>
            <p className="text-sm text-gray-600">
              Professional verification and secure storage for all your business mail.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-left">
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="font-medium text-black">Real-time notifications</p>
            <p className="text-sm text-gray-600">Get instant alerts when mail arrives and track delivery status.</p>
          </div>
        </div>
      </div>

      <Button onClick={onNext} className="w-full max-w-sm bg-black hover:bg-gray-800 text-white rounded-full py-3">
        Create a business account
      </Button>
    </div>
  );
}
