"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { verifyLoginCredential } from "@/redux/feature/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CredentialForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loginToken, method, loading, error } = useSelector(
    (s: RootState) => s.auth
  );

  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      verifyLoginCredential({
        login_token: loginToken!,
        [method ?? "password"]: value,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type={method === "password" ? "password" : "text"}
        placeholder={`Enter your ${method ?? "password"}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verifying..." : "Login"}
      </Button>
    </form>
  );
}
