"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";

const DimensionInput = () => {
  const dispatch = useAppDispatch();
  const receivingState = useAppSelector((state) => state.receiving);

  // Initialize state from receiving.dimension (e.g., "30x30x30" -> { length: "30", width: "30", height: "30" })
  const initialDimensions = receivingState.dimension
    ? receivingState.dimension.split("x")
    : ["", "", ""];
  const [length, setLength] = useState<string>(initialDimensions[0] || "");
  const [width, setWidth] = useState<string>(initialDimensions[1] || "");
  const [height, setHeight] = useState<string>(initialDimensions[2] || "");
  const [error, setError] = useState<string | null>(null);

  // Update context whenever length, width, or height changes
  useEffect(() => {
    // Validate inputs
    if (length === "" || width === "" || height === "") {
      setError(null);
      dispatch(updateReceivingState({ key: "dimension", value: null }));
      return;
    }

    const parsedLength = parseFloat(length);
    const parsedWidth = parseFloat(width);
    const parsedHeight = parseFloat(height);

    if (isNaN(parsedLength) || isNaN(parsedWidth) || isNaN(parsedHeight)) {
      setError("All dimensions must be valid numbers");
      dispatch(updateReceivingState({ key: "dimension", value: null }));
      return;
    }

    if (parsedLength <= 0 || parsedWidth <= 0 || parsedHeight <= 0) {
      setError("All dimensions must be positive numbers");
      dispatch(updateReceivingState({ key: "dimension", value: null }));
      return;
    }

    // Combine valid inputs into lengthxwidthxheight format
    const dimensionString = `${parsedLength}x${parsedWidth}x${parsedHeight}`;
    setError(null);
    dispatch(updateReceivingState({ key: "dimension", value: dimensionString }));
  }, [length, width, height, dispatch]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="length" className="text-sm font-medium">
        Package Length (cm)
      </Label>
      <Input
        id="length"
        type="number"
        step="0.01"
        min="0"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        placeholder="Enter length in cm"
        className="w-full h-12 rounded-lg"
      />
      <Label htmlFor="width" className="text-sm font-medium">
        Package Width (cm)
      </Label>
      <Input
        id="width"
        type="number"
        step="0.01"
        min="0"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        placeholder="Enter width in cm"
        className="w-full h-12 rounded-lg"
      />
      <Label htmlFor="height" className="text-sm font-medium">
        Package Height (cm)
      </Label>
      <Input
        id="height"
        type="number"
        step="0.01"
        min="0"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Enter height in cm"
        className="w-full h-12 rounded-lg"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DimensionInput;
