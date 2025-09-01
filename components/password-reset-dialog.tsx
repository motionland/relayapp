"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, X } from "lucide-react"

interface PasswordResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
}

export function PasswordResetDialog({ open, onOpenChange, userName }: PasswordResetDialogProps) {
  const [generatedPassword] = useState("StrongTree72$")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-lg font-semibold">Password Reset Successful</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
          >
            
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">New Password Generated</span>
            </div>
            <p className="text-sm text-green-700 mb-3">A new password has been generated for {userName}:</p>

            <div className="bg-gray-50 border rounded p-3 text-center">
              <code className="text-lg font-mono font-semibold">{generatedPassword}</code>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Please share this password securely with the user. They should change it on first login.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} className="w-full bg-black hover:bg-gray-800 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
