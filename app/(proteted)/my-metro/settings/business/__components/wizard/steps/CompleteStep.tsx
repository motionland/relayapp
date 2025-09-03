// CompleteStep.tsx (defensive - tidak merubah desain)
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Props {
  formData?: any;
  setFormData?: (d: any) => void;
  onDone?: () => void;
}

export default function CompleteStep({ formData, setFormData, onDone }: Props) {
  // safe fallback: pastikan kita punya array
  const teamMembers: Array<{ type?: string; value?: string }> = Array.isArray(formData?.teamMembers)
    ? formData.teamMembers
    : [];

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2"> All Set!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Welcome to Metro. Your business account is now fully set up and ready to use!
        </p>
      </div>

      {/* optional: show invited team members if ada (tidak mengubah layout) */}
      {teamMembers.length > 0 && (
        <div className="max-w-md mx-auto text-left bg-gray-50 rounded p-4">
          <h3 className="font-medium text-gray-800 mb-2">Invited Team Members</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {teamMembers.map((m, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>
                  {m.type === "hashtag"
                    ? m.value || "@metrousername"
                    : m.type === "phone"
                    ? m.value || "Phone Number"
                    : m.type === "email"
                    ? m.value || "Email Address"
                    : m.value || "Member"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onDone} className="hover:bg-green-700 bg-black">
        Go to Dashboard
      </Button>
    </div>
  );
}
