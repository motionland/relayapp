import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  type IScannerControls,
} from "@zxing/browser";

interface MatrixScannerProps {
  onDetected?: (result: string) => void;
  onUseScanner?: boolean;
}

const MatrixScanner = ({
  onDetected,
  onUseScanner = true,
}: MatrixScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleDetection = useCallback(
    (code: string) => {
      if (onDetected) onDetected(code);
    },
    [onDetected]
  );

  // Draw bounding box around detected barcode
  const drawBoundingBox = useCallback((points: any[]) => {
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
    ctx.strokeStyle = "limegreen";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const x = pt.x * scaleX;
      const y = pt.y * scaleY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    if (points.length > 0) {
      const pt0 = points[0];
      ctx.lineTo(pt0.x * scaleX, pt0.y * scaleY);
    }

    ctx.stroke();
  }, []);

  // Set up client-side detection
  useEffect(() => {
    setIsClient(true);
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  // Handle scanner toggle based on boolean value
  useEffect(() => {
    if (!isClient) return;

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
              if (format === BarcodeFormat.DATA_MATRIX || 
                  format === BarcodeFormat.PDF_417 || 
                  format === BarcodeFormat.CODE_128) {
                const text = res.getText();
                console.log(text);
                handleDetection(text);
                setResult(text);
                const points = res.getResultPoints();
                if (points) drawBoundingBox(points);
              }
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
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isClient, handleDetection, onUseScanner, drawBoundingBox]);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-green-500 rounded-lg opacity-80 animate-pulse"></div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white text-sm">
          Position 2D matrix code within the green frame
        </p>
        {result && <p className="text-white text-sm mt-2">{result}</p>}
      </div>
    </div>
  );
};

export default MatrixScanner;
