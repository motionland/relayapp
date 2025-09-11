"use client";

import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  type IScannerControls,
} from "@zxing/browser";
import { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { createWorker } from "tesseract.js";
import { useAppSelector, useAppDispatch, updateReceivingState } from "@/redux";

const OCRScanner = () => {
  const receivingState = useAppSelector((state) => state.receiving);
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Draw bounding box around detected barcode
  const drawBoundingBox = useCallback(
    (points: any[], format: BarcodeFormat) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || !points || points.length < 2) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { videoWidth, videoHeight } = video;
      const displayWidth = video.clientWidth;
      const displayHeight = video.clientHeight;

      const scaleX = displayWidth / videoWidth;
      const scaleY = displayHeight / videoHeight;

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = format === BarcodeFormat.PDF_417 ? "blue" : "limegreen";
      ctx.lineWidth = 3;
      ctx.beginPath();

      const maxPoints =
        format === BarcodeFormat.PDF_417
          ? Math.min(points.length, 4)
          : points.length;

      for (let i = 0; i < maxPoints; i++) {
        const pt = points[i];
        const x = pt.x * scaleX;
        const y = pt.y * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      if (maxPoints > 0) {
        const pt0 = points[0];
        ctx.lineTo(pt0.x * scaleX, pt0.y * scaleY);
      }

      ctx.stroke();
    },
    []
  );

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (devices.length === 0) return;

        controlsRef.current = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (res, err) => {
            if (res) {
              const format = res.getBarcodeFormat();
              if (format === BarcodeFormat.PDF_417) {
                const text = res.getText();
                // handleDetection(text);
              }
              const points = res.getResultPoints();
              if (points) drawBoundingBox(points, format);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
    };
  }, [drawBoundingBox]);

  const handleCaptureAndScan = async () => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      if (!videoRef.current || !canvasRef.current) {
        dispatch(updateReceivingState({ key: "currentStep", value: 2 }));
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        dispatch(updateReceivingState({ key: "currentStep", value: 2 }));
        return;
      }

      // video.pause();

      canvas.style.display = "block";
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.objectFit = "cover";
      const imageData = canvas.toDataURL("image/jpeg");

      try {
        const worker = await createWorker();
        await worker.reinitialize("eng");
        await worker.setParameters({
          tessedit_char_whitelist:
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        });

        const result = await worker.recognize(
          // "https://i.postimg.cc/prtmn4zy/image.png"
          "https://i.postimg.cc/FsC0ypdv/image.png",
          // imageData
        );

        if (result.data.text && result.data.text.trim()) {
          const allText = result.data.text.trim();
          const lines = allText.split("\n").map((line) => line.trim());
          const customerLine =
            lines.find((line) => /(ZMC|ZMR|MRC)\w{3,15}/i.test(line)) || "";
          const customerCode =
            customerLine.match(/(ZMC|ZMR|MRC)\w{3,15}/i)?.[0] || "";
          console.log("allText", allText);
          console.log("lines", lines);
          console.log("customerLine", customerLine);
          console.log(customerCode);

          // Set customer code for lookup in step 2
          dispatch(
            updateReceivingState({ key: "currentLabel", value: customerLine })
          );
          dispatch(
            updateReceivingState({ key: "customerCode", value: customerCode })
          );

          // Proceed to step 2
          dispatch(updateReceivingState({ key: "currentStep", value: 2 }));
        }
      } catch (ocrError) {
        console.error("OCR failed:", ocrError);
        dispatch(updateReceivingState({ key: "currentStep", value: 2 }));
      } finally {
        // Cleanup if needed
      }
    } catch (error) {
      console.error("Capture failed:", error);
      dispatch(updateReceivingState({ key: "currentStep", value: 2 }));
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-md mx-auto overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-80 object-cover"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-28 border-2 border-white rounded-md opacity-70"></div>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Position PDF417 barcode within frame
        </p>
      </div>
      <div className="bg-white rounded-t-xl -mt-4 relative z-10 p-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-medium mb-1">
              Step 1: Scan Shipping Label
            </h2>
            <p className="text-gray-500 text-sm">
              Position the shipping label within the frame
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
              onClick={handleCaptureAndScan}
              disabled={isScanning}
            >
              <Scan className="h-5 w-5 mr-2" />
              {isScanning ? "Scanning..." : "Scan Shipping Label"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OCRScanner;
