import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface ConfirmationButtonsProps {
  onConfirm: () => void;
  onCancel: () => void;
  action: string;
}

export function ConfirmationButtons({ onConfirm, onCancel, action }: ConfirmationButtonsProps) {
  return (
    <div className="flex mt-2 mb-2 space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="px-4 py-2 flex items-center bg-success/10 text-success border-success/30 hover:bg-success/20 hover:text-success hover:border-success/50"
        onClick={onConfirm}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Confirm
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="px-4 py-2 flex items-center bg-danger/10 text-danger border-danger/30 hover:bg-danger/20 hover:text-danger hover:border-danger/50"
        onClick={onCancel}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </div>
  );
}