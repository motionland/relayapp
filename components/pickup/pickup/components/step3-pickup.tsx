import {
  AlertCircle,
  Camera,
  CheckCircle,
  Loader2,
  Package,
  RefreshCcw,
} from "lucide-react";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useVerifyPackage } from "@/hooks/use-verify-package";
import { useAppDispatch, useAppSelector } from "@/redux";
import { PackagePickup, updatePickupState } from "@/redux/feature/pickup";

// TypeScript interfaces
interface Package {
  id: string;
}

interface VerifiedPackages {
  [key: string]: boolean;
}

const Step3Pickup: FC = () => {
  const pickupState = useAppSelector((state) => state.pickup);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const {
    execute: verifyPackage,
    isLoading: isVerifyLoading,
    isError: isVerifyError,
    error: verifyError,
  } = useVerifyPackage();
  const [verifiedPackages, setVerifiedPackages] = useState<VerifiedPackages>(
    {}
  );
  const [currentScanTarget, setCurrentScanTarget] = useState<string | null>(
    null
  );
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationFailed, setIsVerificationFailed] =
    useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setError(null);
      }
    } catch (err) {
      setError(
        "Unable to access camera. Please allow camera permissions and ensure your device has a camera."
      );
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start capturing process
  const startCapturing = useCallback(
    async (id: string) => {
      setCurrentScanTarget(id);
      setIsCapturing(true);
      setIsVerificationFailed(false);
      setCapturedImage(null);
      setError(null);
      await startCamera();
    },
    [startCamera]
  );

  // Capture snapshot from video
  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Camera or canvas not available.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        setError("Unable to get canvas context.");
        return;
      }

      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Draw video frame to canvas
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Convert to base64 and set as temporary preview
      const base64Image = canvasRef.current.toDataURL("image/jpeg");
      setCapturedImage(base64Image);

      // Stop camera to show preview
      stopCamera();

      // Wait 2 seconds to show preview before sending to API
      setTimeout(async () => {
        try {
          // Send to Laravel API
          if (!session) {
            throw new Error("Session not available");
          }

          const response = await verifyPackage({
            verify_image: base64Image,
          });

          if (response.ok) {
            if (currentScanTarget) {
              setVerifiedPackages((prev) => ({
                ...prev,
                [currentScanTarget]: true,
              }));
              setCurrentScanTarget(null);
              setIsCapturing(false);
              setCapturedImage(null);
              setIsVerificationFailed(false);
            }
          } else {
            setError(response.message || "Barcode verification failed.");
            setIsVerificationFailed(true);
          }
        } catch (error) {
          setError("Error processing image: " + (error as Error).message);
          setIsVerificationFailed(true);
        } finally {
          setIsLoading(false);
        }
      }, 2000); // 2-second preview
    } catch (error) {
      setError("Error capturing image: " + (error as Error).message);
      setIsLoading(false);
    }
  }, [currentScanTarget, stopCamera, verifyPackage]);

  // Retry capture
  const retryCapture = useCallback(() => {
    setIsVerificationFailed(false);
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  // Cleanup camera on unmount or when capturing is canceled
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const allVerified =
    Object.values(verifiedPackages).every(Boolean) &&
    Object.keys(verifiedPackages).length === pickupState.selectedPackages.length;

  const onBack = () => {
    dispatch(updatePickupState({ key: "currentStep", value: 2 }));
  };

  const onComplete = () => {
    dispatch(updatePickupState({ key: "currentStep", value: 4 }));
  };

  return (
    <div className="space-y-6 px-4">
      <div>
        <h2 className="text-xl font-medium mb-1">Verify Package Barcodes</h2>
        <p className="text-gray-500 text-sm">
          Capture each package barcode to verify before handoff
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">
                Security Verification Required
              </p>
              <p className="text-sm text-amber-700 mt-1">
                For security purposes, all package barcodes must be captured
                before handoff to the customer.
              </p>
            </div>
          </div>
        </div>

        {error && !isVerificationFailed && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">Packages to Verify</p>
            <p className="text-sm font-medium">
              {Object.values(verifiedPackages).filter(Boolean).length} of{" "}
              {pickupState.selectedPackages.length} verified
            </p>
          </div>

          {isCapturing ? (
            <Card className="overflow-hidden">
              <div className="bg-black text-white p-3 text-sm flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>
                  Capture Metro barcode on package: {currentScanTarget}
                </span>
              </div>

              <div className="relative aspect-video bg-black">
                {isVerificationFailed && capturedImage ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <img
                      src={capturedImage}
                      alt="Failed capture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex flex-col items-center justify-center">
                      <p className="text-red-600 font-medium mb-2">
                        Verification Failed: {error}
                      </p>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="p-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCapturing(false);
                    setCurrentScanTarget(null);
                    setError(null);
                    setIsVerificationFailed(false);
                    setCapturedImage(null);
                    stopCamera();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                {isVerificationFailed ? (
                  <Button
                    onClick={retryCapture}
                    disabled={isLoading}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Retry Capture
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={captureImage}
                    disabled={isLoading || !!capturedImage}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Capture Image"
                    )}
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-2">
              {pickupState.selectedPackages.map((pkg: PackagePickup) => {
                const isVerified = verifiedPackages[pkg.id] || false;

                return (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-xl transition-colors duration-200 ${
                      isVerified
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {isVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <p className="font-medium truncate">
                            {pkg.tracking_number}
                          </p>
                          <p className="text-xs mt-0.5">
                            {isVerified ? (
                              <span className="text-green-600">Verified</span>
                            ) : (
                              <span className="text-gray-500">
                                Pending verification
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {!isVerified && (
                        <Button
                          size="sm"
                          onClick={() => startCapturing(pkg.tracking_number)}
                          className="bg-black hover:bg-gray-800 text-white"
                        >
                          Capture
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4">
          {!allVerified && (
            <p className="text-sm text-amber-600 text-center">
              Please verify all packages before proceeding
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 rounded-xl"
              onClick={onBack}
            >
              Back
            </Button>

            <Button
              className={`h-12 rounded-xl ${
                allVerified
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={onComplete}
              disabled={!allVerified}
            >
              Complete Verification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Pickup;
