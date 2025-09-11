"use client";
import React, { useCallback } from "react";
import Step1Receiving from "./components/step1-receiving";
import Step2Receiving from "./components/step2-receiving";
import Step3Receiving from "./components/step3-receiving";
import Step4Receiving from "./components/step4-receiving";
import { useAppSelector } from "@/redux";

const ReceivingViewMobile = () => {
  const receivingState = useAppSelector((state) => state.receiving);

  const renderStepContent = () => {
    switch (receivingState.currentStep) {
      case 1:
        return <Step1Receiving />;
      case 2:
        return <Step2Receiving />;
      case 3:
        return <Step3Receiving />;
      case 4:
        return <Step4Receiving />;
      default:
        return <div>Step 1</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {renderStepContent()}
    </div>
  );
};

export default ReceivingViewMobile;
