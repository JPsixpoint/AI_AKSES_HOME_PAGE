import { Button } from "../ui/button";
import { Check, X } from "lucide-react";

interface ConfirmationButtonsProps {
  onConfirm: () => void;
  onCancel: () => void;
  action: string;
}

export function ConfirmationButtons({ onConfirm, onCancel, action }: ConfirmationButtonsProps) {
  const getActionText = (actionType: string) => {
    switch (actionType) {
      case "create_deal":
        return "Create Deal";
      case "update_deal":
        return "Update Deal";
      case "delete_deal":
        return "Delete Deal";
      case "start_prescreening":
        return "Start Pre-Screening";
      default:
        return "Confirm";
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        className="bg-success hover:bg-success/80 text-white"
        onClick={onConfirm}
      >
        <Check className="h-4 w-4 mr-1" />
        {getActionText(action)}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-danger text-danger hover:bg-danger/10"
        onClick={onCancel}
      >
        <X className="h-4 w-4 mr-1" />
        Cancel
      </Button>
    </div>
  );
}