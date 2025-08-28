"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import Image from "next/image"

interface ScannerViewProps {
  onBarcodeDetected: (barcode: string) => void
  onCancel: () => void
}

export default function ScannerView({ onBarcodeDetected, onCancel }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        setIsLoading(true)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false)
            // Mock barcode detection after 3 seconds for demo purposes
            setTimeout(() => {
              onBarcodeDetected("CUST-20250327-12345")
            }, 3000)
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Could not access camera. Please check permissions.")
        setIsLoading(false)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [onBarcodeDetected])

  // Draw PDF417 guide overlay
  // useEffect(() => {
  //   const drawGuide = () => {
  //     const canvas = canvasRef.current
  //     const video = videoRef.current

  //     if (!canvas || !video || isLoading) return

  //     const ctx = canvas.getContext("2d")
  //     if (!ctx) return

  //     // Match canvas size to video
  //     canvas.width = video.videoWidth
  //     canvas.height = video.videoHeight

  //     // Clear canvas
  //     ctx.clearRect(0, 0, canvas.width, canvas.height)

  //     // Draw semi-transparent overlay
  //     ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
  //     ctx.fillRect(0, 0, canvas.width, canvas.height)

  //     // Calculate guide dimensions (PDF417 is rectangular)
  //     const guideWidth = canvas.width * 0.8
  //     const guideHeight = guideWidth * 0.3 // PDF417 typically has 3:1 width to height ratio

  //     // Draw transparent guide area
  //     ctx.clearRect((canvas.width - guideWidth) / 2, (canvas.height - guideHeight) / 2, guideWidth, guideHeight)

  //     // Draw guide border
  //     ctx.strokeStyle = "#00FF00"
  //     ctx.lineWidth = 2
  //     ctx.strokeRect((canvas.width - guideWidth) / 2, (canvas.height - guideHeight) / 2, guideWidth, guideHeight)

  //     // Add corner markers
  //     const cornerSize = 20
  //     const x = (canvas.width - guideWidth) / 2
  //     const y = (canvas.height - guideHeight) / 2

  //     // Top-left corner
  //     ctx.beginPath()
  //     ctx.moveTo(x, y + cornerSize)
  //     ctx.lineTo(x, y)
  //     ctx.lineTo(x + cornerSize, y)
  //     ctx.stroke()

  //     // Top-right corner
  //     ctx.beginPath()
  //     ctx.moveTo(x + guideWidth - cornerSize, y)
  //     ctx.lineTo(x + guideWidth, y)
  //     ctx.lineTo(x + guideWidth, y + cornerSize)
  //     ctx.stroke()

  //     // Bottom-left corner
  //     ctx.beginPath()
  //     ctx.moveTo(x, y + guideHeight - cornerSize)
  //     ctx.lineTo(x, y + guideHeight)
  //     ctx.lineTo(x + cornerSize, y + guideHeight)
  //     ctx.stroke()

  //     // Bottom-right corner
  //     ctx.beginPath()
  //     ctx.moveTo(x + guideWidth - cornerSize, y + guideHeight)
  //     ctx.lineTo(x + guideWidth, y + guideHeight)
  //     ctx.lineTo(x + guideWidth, y + guideHeight - cornerSize)
  //     ctx.stroke()

  //     // Add text guide
  //     ctx.fillStyle = "#FFFFFF"
  //     ctx.font = "16px Arial"
  //     ctx.textAlign = "center"
  //     ctx.fillText("Align PDF417 barcode within the frame", canvas.width / 2, y + guideHeight + 30)

  //     // Add example barcode text
  //     ctx.fillText("Example: MRCPOP821", canvas.width / 2, y + guideHeight + 60)
  //   }

  //   const interval = setInterval(drawGuide, 100)
  //   return () => clearInterval(interval)
  // }, [isLoading])

  return (
    <Card className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Accessing camera...</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-500">
          <p>{error}</p>
          <Button onClick={onCancel} className="mt-2">
            Go Back
          </Button>
        </div>
      )}

      <div className="relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

        {/* Replace the complex guide with the simpler white border frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white rounded-lg opacity-70"></div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/70 p-2 rounded-lg">
            <p className="text-white text-xs mb-1 text-center">Reference Barcode:</p>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hHTvzg019EPsLZRZ4Jquu4b6j1kcYu.png"
              alt="PDF417 Barcode Example"
              width={150}
              height={50}
              className="mx-auto"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 rounded-full"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
