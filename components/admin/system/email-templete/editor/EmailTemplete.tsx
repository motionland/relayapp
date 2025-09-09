import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TemplateEmailEditor from "./EmailTempleteEditor";
import { useAppDispatch, useAppSelector } from "@/redux";
import { hideForm } from "@/redux/feature/emailTemplete";
import { EmailTemplatePreview } from "./EmailTempletePreview";

const EmailTemplate = () => {
  const dispatch = useAppDispatch();
  const { detail } = useAppSelector((s) => s.emailTemplete);

  const handleCloseEmailTemplateForm = () => {
    dispatch(hideForm());
  };
  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={handleCloseEmailTemplateForm}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Email Template
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Template Key:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                {detail?.key}
              </code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Template Editor Form */}
        <TemplateEmailEditor />

        {/* Email Preview */}
        <EmailTemplatePreview />
      </div>
    </div>
  );
};

export default EmailTemplate;
