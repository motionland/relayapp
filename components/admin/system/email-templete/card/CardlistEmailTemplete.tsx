"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  deleteEmailTemplate,
  EmailTemplateResource,
  getEmailTemplateDetails,
  getEmailTemplates,
  showForm,
} from "@/redux/feature/emailTemplete";
import {
  Copy,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import React, { useEffect } from "react";

interface CardEmailTemplete {
  item: EmailTemplateResource;
}

export const CardEmailTemplete: React.FC<CardEmailTemplete> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handlePreview = () => {
    dispatch(getEmailTemplateDetails(item.id));
  };

  const handleEdit = () => {
    dispatch(showForm({ mode: "edit", template: item }));
  };

  const handleDuplicate = () => {
    dispatch(showForm({ mode: "duplicate", template: item }));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this template?")) {
      dispatch(deleteEmailTemplate(item.key));
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="font-mono text-xs text-blue-600">{item.key}</div>
      <div className="font-mono text-xs text-gray-700 dark:text-gray-300">
        {item.subject}
      </div>
      <div className="text-gray-600 dark:text-gray-400 text-xs">
        {item.content.length > 100
          ? item.content.slice(0, 100) + "..."
          : item.content}
      </div>
      <div className="flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="mr-2 h-4 w-4" />
              Test Send
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const EmailTempleteList = () => {
  const dispatch = useAppDispatch();
  const {
    list: emailTempletes,
    loading,
    error,
  } = useAppSelector((state) => state.emailTemplete);

  useEffect(() => {
    if (emailTempletes.length === 0) {
      dispatch(getEmailTemplates());
    }
  }, [dispatch, emailTempletes.length]);

  // 🔹 Grouping by category (default: "Uncategory")
  const groupedTemplates = React.useMemo(() => {
    return emailTempletes.reduce<Record<string, EmailTemplateResource[]>>(
      (acc, template) => {
        const category = template.category || "Uncategory";
        if (!acc[category]) acc[category] = [];
        acc[category].push(template);
        return acc;
      },
      {}
    );
  }, [emailTempletes]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Templates
            </CardTitle>
          </div>
          <Button onClick={() => dispatch(showForm({ mode: "create" }))}>
            <Plus className="h-4 w-4 mr-2" />
            New Email Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Loading templates...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : emailTempletes.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No email templates found.
            <br />
            <Button
              onClick={() => dispatch(showForm({ mode: "create" }))}
              size="sm"
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first template
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category} className="border rounded-lg">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
                  <h3 className="font-semibold text-lg">{category}</h3>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm bg-gray-50 dark:bg-gray-800">
                    <div>Template Key</div>
                    <div>Subject</div>
                    <div>Body Preview</div>
                    <div>Actions</div>
                  </div>

                  <div className="divide-y">
                    {templates.map((template) => (
                      <CardEmailTemplete key={template.id} item={template} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
