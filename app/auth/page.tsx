"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LoginForm from "./LoginForm";
import CredentialForm from "./CredentialForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const { step, method, message } = useSelector((s: RootState) => s.auth);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {step === "idle" && "Login"}
            {step === "awaitingCredential" &&
              `Enter your ${method ?? "credential"}`}
            {step === "authenticated" && "Welcome 🎉"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <p className="text-center text-sm text-muted-foreground mb-4">
              {message}
            </p>
          )}
          {step === "idle" && <LoginForm />}
          {step === "awaitingCredential" && <CredentialForm />}
          {step === "authenticated" && (
            <p className="text-green-600 text-center">
              ✅ You are logged in successfully!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
