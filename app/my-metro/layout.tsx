"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { tokenStorage } from "@/redux/helper/axios";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useSelector((s: RootState) => s.auth.token);

  useEffect(() => {
    const authToken = token || tokenStorage.getAuthToken();
    if (!authToken) {
      router.replace("/auth");
    }
  }, [token, router]);

  return <>{children}</>;
}
