"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";

const SenderInput = () => {
  const dispatch = useAppDispatch();
  const receivingState = useAppSelector((state) => state.receiving);
  const [senderName, setSenderName] = useState<string>(
    receivingState.sender_name || ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleSenderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSenderName(value);

    // Validate input
    if (value === "") {
      setError(null);
      dispatch(updateReceivingState({ key: "sender_name", value: null }));
      return;
    }

    setError(null);
    dispatch(updateReceivingState({ key: "sender_name", value }));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="senderName" className="text-sm font-medium">
        Sender Name
      </Label>
      <Input
        id="senderName"
        type="text"
        value={senderName}
        onChange={handleSenderNameChange}
        placeholder="Enter sender name"
        className="w-full h-12 rounded-lg"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SenderInput;
