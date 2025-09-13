'use client'
import React from 'react'
import Step1Pickup from './components/step1pickup';
import Step2Pickup from './components/step2-pickup';
import Step3Pickup from './components/step3-pickup';
import Step4Pickup from './components/step4-pickup';
import Step5Pickup from './components/step5-pickup';
import { useAppSelector } from '@/redux';

const PickupViewMobile = () => {
  const pickupState = useAppSelector((state) => state.pickup)

  const renderStepContent = () => {
    switch (pickupState.currentStep) {
      case 1:
        return <Step1Pickup />;
      case 2:
        return <Step2Pickup />;
      case 3:
        return <Step3Pickup />;
      case 4:
        return <Step4Pickup />;
      case 5:
        return <Step5Pickup />;
    }
  };

  return (
    <div className="flex flex-col min-fit bg-white">
      {renderStepContent()}
    </div>
  );
}

export default PickupViewMobile