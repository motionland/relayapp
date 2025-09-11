"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";

const WeightInput = () => {
  const dispatch = useAppDispatch();
  const receivingState = useAppSelector((state) => state.receiving);
  const [weight, setWeight] = useState<string>(
    receivingState.weight?.toString() || ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeight(value);

    // Validate input
    if (value === "") {
      setError(null);
      dispatch(updateReceivingState({ key: "weight", value: null }));
      return;
    }

    const parsedWeight = parseFloat(value);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError("Weight must be a positive number");
      dispatch(updateReceivingState({ key: "weight", value: null }));
    } else {
      setError(null);
      dispatch(updateReceivingState({ key: "weight", value: parsedWeight }));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="weight" className="text-sm font-medium">
        Package Weight (kg)
      </Label>
      <Input
        id="weight"
        type="number"
        step="0.01"
        min="0"
        value={weight}
        onChange={handleWeightChange}
        placeholder="Enter weight in kg"
        className="w-full h-12 rounded-lg"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default WeightInput;
