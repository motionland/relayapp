"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle } from "lucide-react";

interface Props {
  onUpload?: (field: string, file: File) => Promise<void>;
}

export default function DocumentsStep({ onUpload }: Props) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onUpload) await onUpload(key, file);
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Application Received! 🎉</h2>
          <p className="text-gray-600">Great job! Your application is in our system.</p>
        </div>
        <div className="inline-block px-4 py-2 rounded-full bg-amber-200">
          <p className="text-sm text-gray-700">Status: Under Review</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-black mb-2">Speed things up! ⚡</h3>
          <p className="text-gray-600 text-sm mb-6">
            Upload your documents now and we'll fast-track your approval. It's like skipping the line at your favorite
            coffee shop! ☕
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="h-5 w-5 text-gray-400" />
              <div>
                <Label className="font-medium">Business Registration</Label>
                <p className="text-sm text-gray-500">Your official business registration document</p>
              </div>
            </div>
            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" onChange={(e) => handleFileChange(e, "businessRegistration")} />
          </div>

          <div className="rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="h-5 w-5 text-gray-400" />
              <div>
                <Label className="font-medium">Tax ID Certificate (EIN)</Label>
                <p className="text-sm text-gray-500">Your EIN certificate from the IRS</p>
              </div>
            </div>
            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" onChange={(e) => handleFileChange(e, "taxIdCertificate")} />
          </div>

          <div className="rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="h-5 w-5 text-gray-400" />
              <div>
                <Label className="font-medium">Government ID</Label>
                <p className="text-sm text-gray-500">Driver's license or passport</p>
              </div>
            </div>
            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" onChange={(e) => handleFileChange(e, "governmentId")} />
          </div>
        </div>
      </div>
    </div>
  );
}
