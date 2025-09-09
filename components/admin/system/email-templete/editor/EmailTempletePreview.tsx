"use client";

import { replaceVariables } from "@/app/helpers/replaceVariable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux";
import { Mail } from "lucide-react";
import { useState } from "react";

export const EmailTemplatePreview = () => {
  const { detail, draft } = useAppSelector((state) => state.emailTemplete);
  const [isMobile, setIsMobile] = useState(false);

  // Pilih draft kalau ada, kalau tidak pakai detail
  const template = draft || detail;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Preview
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={!isMobile ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMobile(false)}
            >
              Desktop
            </Button>
            <Button
              variant={isMobile ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMobile(true)}
            >
              Mobile
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isMobile ? (
          /* Desktop Email Preview */
          <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
            {/* Email Header */}
            <div className="bg-gray-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-black">
                      Metro Package Manager
                    </div>
                    <div className="text-xs text-gray-500">
                      notifications@metropackage.com
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">now</div>
              </div>
            </div>

            {/* Email Subject */}
            {template?.key !== "email_header" &&
              template?.key !== "email_footer" && (
                <div className="px-4 py-2 bg-blue-50 border-b">
                  <div className="font-semibold text-black text-sm">
                    {replaceVariables(template?.subject)}
                  </div>
                </div>
              )}

            {/* Email Body */}
            <div className="p-4 bg-white max-h-96 overflow-y-auto">
              {template?.key === "email_header" ||
              template?.key === "email_footer" ? (
                <div className="text-xs font-mono bg-gray-100 p-3 rounded">
                  <div className="text-gray-600 mb-2">HTML Preview:</div>
                  <div className="whitespace-pre-wrap text-gray-800">
                    <div
                      className="origin-top-left border rounded bg-white not-tailwind"
                      style={{
                        transform: "scale(0.6)",
                        transformOrigin: "top left",
                        width: "167%", // kompensasi scale
                      }}
                      dangerouslySetInnerHTML={{
                        __html: template.content || "",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-black">
                  <div
                    className="prose prose-sm max-w-none not-tailwind"
                    dangerouslySetInnerHTML={{
                      __html: replaceVariables(template?.content || ""),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Email Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-4">
                  <button className="hover:text-blue-600">Reply</button>
                  <button className="hover:text-blue-600">Forward</button>
                  <button className="hover:text-blue-600">Archive</button>
                </div>
                <div>📎 No attachments</div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Email Preview */
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-[280px] h-[580px] bg-black rounded-[40px] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="bg-white px-6 py-2 flex justify-between items-center text-black text-sm font-medium">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-black rounded-sm">
                        <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Email App Header */}
                  <div className="bg-blue-500 px-4 py-3 flex items-center gap-3 text-white">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Mail className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Mail</div>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div className="flex-1 bg-white overflow-y-auto">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          M
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-black">
                            Metro Package Manager
                          </div>
                          <div className="text-xs text-gray-500">
                            notifications@metropackage.com
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      {template?.key !== "email_header" &&
                        template?.key !== "email_footer" && (
                          <div className="font-semibold text-black text-sm mb-1">
                            {replaceVariables(template?.subject)}
                          </div>
                        )}
                      <div className="text-xs text-gray-500">now</div>
                    </div>

                    {/* Email Body */}
                    <div className="p-4">
                      {template?.key === "email_header" ||
                      template?.key === "email_footer" ? (
                        <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                          <div className="text-gray-600 mb-1 text-xs">
                            HTML:
                          </div>
                          <div
                            className="whitespace-pre-wrap text-gray-800 text-xs leading-tight not-tailwind"
                            dangerouslySetInnerHTML={{
                              __html: template?.content || "",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 text-sm text-black leading-relaxed not-tailwind">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: replaceVariables(template?.content || ""),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="bg-gray-50 p-3 border-t flex justify-around">
                    <button className="flex flex-col items-center gap-1 text-xs text-gray-600">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        ↩
                      </div>
                      Reply
                    </button>
                    <button className="flex flex-col items-center gap-1 text-xs text-gray-600">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        ↪
                      </div>
                      Forward
                    </button>
                    <button className="flex flex-col items-center gap-1 text-xs text-gray-600">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        🗑
                      </div>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Available Variables</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[first_name]</code>
                  <span className="text-gray-500">John</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[last_name]</code>
                  <span className="text-gray-500">Doe</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[app_name]</code>
                  <span className="text-gray-500">Metro Package Manager</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[pickup_code]</code>
                  <span className="text-gray-500">12345</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[facility_name]</code>
                  <span className="text-gray-500">Main Office</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[sender_name]</code>
                  <span className="text-gray-500">Amazon</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[tracking_number]</code>
                  <span className="text-gray-500">1Z999AA1234567890</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <code className="text-blue-600">[support_email]</code>
                  <span className="text-gray-500">support@metro.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
