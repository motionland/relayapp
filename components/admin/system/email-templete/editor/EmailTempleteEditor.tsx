"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Save, Send } from "lucide-react";
import {
  createEmailTemplate,
  hideForm,
  StoreEmailTemplateRequest,
  updateEmailTemplate,
} from "@/redux/feature/emailTemplete";
import { useAppDispatch, useAppSelector } from "@/redux";

const TemplateEmailEditor = () => {
  const dispatch = useAppDispatch();
  const { showEmailTemplateForm, detail: initial } = useAppSelector(
    (s) => s.emailTemplete
  );
  const { mode } = showEmailTemplateForm;

  const [form, setForm] = useState<StoreEmailTemplateRequest>({
    name: "",
    key: "",
    subject: "",
    content: "",
    language: "en_US",
    title: "",
    category: "",
    status: "active",
  });

  useEffect(() => {
    if ((initial && mode === "edit") || mode === "duplicate") {
      setForm({
        name: initial?.name || "",
        key: initial?.key || "",
        subject: initial?.subject || "",
        content: initial?.content || "",
        language: initial?.language || "en_US",
        title: initial?.title || "",
        category: initial?.category || "",
        status: "active",
      });
    }
  }, [initial, mode]);

  const handleChange =
    (field: keyof StoreEmailTemplateRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    if (initial && mode === 'edit') {
      await dispatch(
        updateEmailTemplate({
          key: initial.key,
          body: form
        })
      )
    } else {
      await dispatch(
        createEmailTemplate({
          ...form,
          title: form.name
        })
      )
    }
    dispatch(hideForm())
  };

  const isHeaderOrFooter =
    form.key === "email_header" || form.key === "email_footer";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Template" : "Edit Template"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Name */}
        <div className="space-y-2">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Enter template name..."
          />
        </div>

        {/* Template Key */}
        <div className="space-y-2">
          <Label htmlFor="templateKey">Template Key</Label>
          <Input
            id="templateKey"
            value={form.key}
            onChange={handleChange("key")}
            placeholder="template_key"
            className="font-mono"
            disabled={mode === "edit"}
          />
          {mode === "edit" && (
            <p className="text-xs text-gray-500">
              Template key cannot be changed
            </p>
          )}
        </div>

        {/* Category hanya untuk Create */}
        {mode === "create" && (
          <div className="space-y-2">
            <Label htmlFor="templateCategory">Category</Label>
            <Input
              id="templateCategory"
              value={form.category || ""}
              onChange={handleChange("category")}
              placeholder="Enter category..."
            />
          </div>
        )}

        {/* Subject (kecuali header/footer) */}
        {!isHeaderOrFooter && (
          <div className="space-y-2">
            <Label htmlFor="templateSubject">Subject Line</Label>
            <Input
              id="templateSubject"
              value={form.subject}
              onChange={handleChange("subject")}
              placeholder="Enter subject line..."
              className="font-mono"
            />
          </div>
        )}

        {/* Content / HTML */}
        <div className="space-y-2">
          <Label htmlFor="templateContent">
            {isHeaderOrFooter ? "HTML Template" : "Email Content"}
          </Label>
          <Textarea
            id="templateContent"
            rows={isHeaderOrFooter ? 20 : 12}
            value={form.content}
            onChange={handleChange("content")}
            placeholder="Enter your email template content here..."
            className="font-mono"
          />
          <p className="text-xs text-gray-500">
            Use variables like [first_name], [app_name], [pickup_code], etc.
          </p>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="templateLanguage">Language</Label>
          <Select
            value={form.language}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, language: val as 'en_US' }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_US">English (US)</SelectItem>
              {/* <SelectItem value="es_ES">Spanish (ES)</SelectItem> */}
              {/* <SelectItem value="fr_FR">French (FR)</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="templateStatus">Status</Label>
          <Select
            value={form.status}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, status: val as 'active' | 'inactive' | 'draft' }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Test Send
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === "create" ? "Create Template" : "Save Template"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateEmailEditor;
