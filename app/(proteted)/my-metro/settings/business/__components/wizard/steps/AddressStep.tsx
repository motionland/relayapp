"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  formData: any;
  setFormData: (d: any) => void;
}

export default function AddressStep({ formData, setFormData }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="123 Business St"
        />
      </div>
      <div>
        <Label htmlFor="suite">Apt, Suite, etc. (Optional)</Label>
        <Input
          id="suite"
          value={formData.suite}
          onChange={(e) => setFormData({ ...formData, suite: e.target.value })}
          placeholder="Suite 100"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            placeholder="12345"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notificationPreference">Notification Preference</Label>
        <Select
          value={formData.notificationPreference}
          onValueChange={(value) => setFormData({ ...formData, notificationPreference: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="How would you like to be notified?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="text">Text Message</SelectItem>
            <SelectItem value="phone">Phone Call</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the Terms & Conditions and Privacy Policy
        </Label>
      </div>
    </div>
  );
}
