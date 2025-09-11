"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const MagicLink = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      console.log("Magic Link Token:", tokenParam);
      handleLoginMagicLink(tokenParam);
    } else {
      setStatus("error");
      setMessage("No magic link token found. Please use a valid magic link.");
    }
  }, [searchParams]);

  const handleLoginMagicLink = async (tokenValue: string) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        loginType: "magiclink",
        token_magiclink: tokenValue,
      });

      if (result?.ok) {
        setStatus("success");
        setMessage("Login successful!");
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        setStatus("error");
        setMessage(result?.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "An error occurred during login: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 space-y-6">
        {/* <div className="flex items-center justify-center mb-6">
          <Image src={Metro} alt="Logo" width={48} height={48} />
        </div> */}

        <h1 className="text-2xl font-bold text-center">Magic Link</h1>

        {isLoading ? (
          <p className="text-center">Logging you in, please wait...</p>
        ) : (
          <>
            {status === "success" && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-center">
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-center">
                {message}
              </div>
            )}
            {status === "idle" && (
              <p className="text-center text-muted-foreground">
                {searchParams.get("token")
                  ? "Processing your login..."
                  : "No magic link found. Please use a valid magic link."}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MagicLink;
