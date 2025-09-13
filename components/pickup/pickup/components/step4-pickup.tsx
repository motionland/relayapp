import React, { useCallback, useEffect, useState, useRef } from "react";
import { Building, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePostSignature } from "@/hooks/use-post-signature";
import { useAppDispatch, useAppSelector } from "@/redux";
import { PackagePickup, updatePickupState } from "@/redux/feature/pickup";

const Step4Pickup = () => {
  const pickupState = useAppSelector((state) => state.pickup);
  const dispatch = useAppDispatch();
  const { execute: postSignature } = usePostSignature();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Clear and set background
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Get position from event
  const getEventPosition = useCallback(
    (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        // Touch event
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      } else {
        // Mouse event
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      }
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);
      pointsRef.current = [];

      // Get position
      const position = getEventPosition(e, canvas);
      pointsRef.current.push(position);

      // Set up drawing styles
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    },
    [getEventPosition]
  );

  // Draw smooth curve through points
  const drawCurve = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      points: Array<{ x: number; y: number }>
    ) => {
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // Draw smooth curve using quadratic curves
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      // Draw last segment
      if (points.length > 1) {
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }

      ctx.stroke();
    },
    []
  );

  // Draw
  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Prevent scrolling on touch devices
      e.preventDefault();

      // Get current position
      const currentPosition = getEventPosition(e, canvas);
      pointsRef.current.push(currentPosition);

      // Draw all points for smooth line
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";

      drawCurve(ctx, pointsRef.current);
    },
    [isDrawing, getEventPosition, drawCurve]
  );

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);

    // Only mark as captured if we actually drew something
    if (pointsRef.current.length > 1) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Finalize the drawing
          ctx.closePath();
        }
      }
    }
  }, []);

  // Clear signature
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pointsRef.current = [];
  }, []);

  // Handle complete - send signature to API and move to next step
  const handleComplete = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      // Get base64 image from canvas
      const base64Image = canvasRef.current.toDataURL("image/png");
      console.log(base64Image);

      // For each package, send the signature
      const signaturePromises = pickupState.selectedPackages.map((pkg: PackagePickup) =>
        postSignature({
          packageId: pkg.id.toString(),
          input: { signature: base64Image },
        })
      );

      // Wait for all signatures to be posted
      await Promise.all(signaturePromises);

      // Move to next step
      dispatch(updatePickupState({ key: "currentStep", value: 5 }));
    } catch (error) {
      console.error("Error posting signature:", error);
      // Still move to next step even if API fails (simulation)
      dispatch(updatePickupState({ key: "currentStep", value: 5 }));
    }
  }, [pickupState.selectedPackages, postSignature, dispatch]);

  return (
    <div className="space-y-6 px-4">
      {/* Customer Signature */}
      <div>
        <h2 className="text-xl font-medium mb-1">Customer Signature</h2>
        <p className="text-gray-500 text-sm">
          Ask customer to sign to confirm receipt
        </p>
      </div>

      {/* Security Verification Required */}
      <div className="bg-red-100 border-2 border-red-500 p-3 rounded-md text-center">
        <p className="text-red-600 font-bold">CHECK CUSTOMER ID OR DL</p>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        {/* Customer */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-gray-400" />
            <p className="font-medium">Customer</p>
          </div>
          <p className="text-gray-700 pl-6">John Smith</p>
        </div>

        {/* Customer Hub Location */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Building className="h-4 w-4 text-gray-400" />
            <p className="font-medium">Customer Hub Location</p>
          </div>
          <div className="pl-6">
            <p className="text-gray-700 font-medium">Downtown Seattle Hub</p>
            <p className="text-gray-500 text-sm mt-1">
              123 Pike Street, Seattle, WA 98101
            </p>
          </div>
        </div>

        {/* Customer Signature */}
        <div
          className="bg-gray-50 rounded-xl h-56 relative overflow-hidden"
          style={{ touchAction: "none" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {pointsRef.current.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
              <Edit className="h-6 w-6 mb-2" />
              <span>Sign here</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-12 border-gray-200 text-gray-700 rounded-xl"
            onClick={clearSignature}
          >
            Clear
          </Button>
          <Button
            className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
            onClick={handleComplete}
            disabled={pointsRef.current.length <= 1}
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Pickup;
