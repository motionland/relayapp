import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Check, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";

const Step3Receiving = () => {
  const receivingState = useAppSelector((state) => state.receiving);
  const dispatch = useAppDispatch();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // console.log(receivingState);

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      // Cleanup function to stop camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        ?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      dispatch(updateReceivingState({ key: "capturedImages", value: [...receivingState.capturedImages, imageData] }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative h-80 bg-black">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />{" "}
          {/* Hidden canvas for image capture */}
          <div className="absolute top-0 right-0 p-2 flex flex-col gap-2 max-h-80 overflow-y-auto z-10 custom-scrollbar">
            {receivingState.capturedImages.length > 3 && (
              <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>
            )}
            {receivingState.capturedImages.length > 3 && (
              <div className="absolute top-0 right-0 w-full h-8 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-10"></div>
            )}
            {receivingState.capturedImages.map((img, index) => (
              <div
                key={index}
                className="w-24 h-24 overflow-hidden rounded-lg border-2 border-green-500 shadow-lg relative group"
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Captured Package ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  <Camera className="h-2 w-2 inline-block mr-0.5" />
                  {index + 1}
                </div>
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateReceivingState({ key: "capturedImages", value: receivingState.capturedImages.filter((_, i) => i !== index) }));
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="w-64 h-64 border-2 border-white rounded-lg opacity-70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white text-sm">
              Center the package in the frame
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-xl -mt-4 relative z-10 p-4">
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-medium mb-1">
              Step 3: Capture Package Image
            </h2>
            <p className="text-gray-500 text-sm">
              Take a photo of the package with the Metro Label clearly visible
              for verification
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {receivingState.capturedImages.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Button
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center shadow-sm"
                  onClick={() => dispatch(updateReceivingState({ key: "currentStep", value: 4 }))}
                >
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    Damage Free, Continue with {receivingState.capturedImages.length}{" "}
                    {receivingState.capturedImages.length === 1 ? "image" : "images"}
                  </span>
                </Button>
                <div className="text-xs text-center text-gray-500 mt-2">
                  {receivingState.capturedImages.length}{" "}
                  {receivingState.capturedImages.length === 1 ? "photo" : "photos"}{" "}
                  successfully captured
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1 py-4 bg-black hover:bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-sm transition-all"
                onClick={captureImage}
              >
                <Camera className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="font-medium">
                  {receivingState.capturedImages.length === 0
                    ? "Capture Package Photo"
                    : "Add Damage Photos"}
                </span>
              </Button>

              {receivingState.capturedImages.length > 0 && (
                <Button
                  className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center px-6 shadow-sm transition-all"
                  onClick={() => dispatch(updateReceivingState({ key: "currentStep", value: 4 }))}
                >
                  <span className="font-medium">Next</span>
                  <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Receiving;
