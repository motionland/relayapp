"use client";

import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  type IScannerControls,
} from "@zxing/browser";
import { useEffect, useRef, useState, useCallback } from "react";

interface RealtimeScannerProps {
  onDetected?: (code: string) => void;
  onBarcodeDetected?: (code: string) => void; // For backward compatibility
  onUseScanner?: boolean; // Changed to boolean
}

export default function RealtimeScanner({
  onUseScanner = false, // Default to false
  onDetected,
  onBarcodeDetected,
}: RealtimeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  // const [isClient, setIsClient] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const detectedOnce = useRef(false);

  // Combine the callbacks for backward compatibility
  const handleDetection = useCallback(
    (code: string) => {
      if (!detectedOnce.current) {
        detectedOnce.current = true;
        if (onDetected) onDetected(code);
        if (onBarcodeDetected) onBarcodeDetected(code);
        // Stop scanner setelah deteksi pertama
        if (controlsRef.current) controlsRef.current.stop();
        setIsScanning(false);
      }
    },
    [onDetected, onBarcodeDetected]
  );
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
    detectedOnce.current = false;
    const codeReader = new BrowserMultiFormatReader();

    // for production
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
                // console.log("PDF417 barcode detected:", text);
                handleDetection(text);
                setResult(text);
              }
              const points = res.getResultPoints();
              if (points) drawBoundingBox(points, format);
            }
          }
        );
        setIsScanning(true);
      } catch (err: any) {
        console.error("Scanner error:", err);
      }
    };

    const stopScanner = () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        setIsScanning(false);
      }
    };

    if (onUseScanner) {
      startScanner(); // Start scanner if true
    } else {
      stopScanner(); // Stop scanner if false
    }

    return () => {
      stopScanner();
    };
  }, [drawBoundingBox, handleDetection, onUseScanner]);

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-b-xl">
      <video
        ref={videoRef}
        className="w-full h-80 object-cover"
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Add the white border frame for consistent UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-80 h-28 border-2 border-white rounded-md opacity-70"></div>
        {result && (
          <p className="text-center text-sm text-gray-100">{result}</p>
        )}
        <p className="text-center text-sm text-gray-100">
          Position PDF417 barcode within frame
        </p>
      </div>
    </div>
  );
}
