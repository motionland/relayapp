// TeamStep.tsx (perbaikan: guard teamMembers)
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface Props {
  formData: any;
  setFormData: (d: any) => void;
}

export default function TeamStep({ formData, setFormData }: Props) {
  // fallback kalau undefined
  const members = Array.isArray(formData?.teamMembers) ? formData.teamMembers : [{ type: "hashtag", value: "" }];

  function updateMember(index: number, upd: any) {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], ...upd };
    setFormData({ ...formData, teamMembers: newMembers });
  }

  function addMember() {
    const newMembers = [...members, { type: "hashtag", value: "" }];
    setFormData({ ...formData, teamMembers: newMembers });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">🎉 Approved!</h3>
        <p className="text-gray-600">
          Your business application has been approved. Now invite team members to receive package pickup notifications.
        </p>
      </div>

      <div className="space-y-4">
        <Label>Invite Team Members</Label>

        {members.map((member: any, index: number) => (
          <div key={index} className="flex gap-2">
            <Select
              value={member.type}
              onValueChange={(value) => updateMember(index, { type: value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hashtag">Metro Hashtag</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
                <SelectItem value="email">Email Address</SelectItem>
              </SelectContent>
            </Select>

            <input
              value={member.value}
              onChange={(e) => updateMember(index, { value: e.target.value })}
              placeholder={
                member.type === "hashtag" ? "@metrousername" : member.type === "phone" ? "Phone Number" : "Email Address"
              }
              className="flex-1 border rounded px-2 py-2"
            />
          </div>
        ))}

        <Button variant="outline" onClick={addMember}>
          Add Another Member
        </Button>
      </div>
    </div>
  );
}
