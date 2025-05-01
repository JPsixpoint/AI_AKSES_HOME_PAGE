import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="mr-3 bg-primary bg-opacity-20 p-3 rounded-lg rounded-tr-none max-w-[85%]">
        <p className="text-sm">{content}</p>
      </div>
      <Avatar className="h-8 w-8 rounded-full bg-primary-lighter flex-shrink-0 flex items-center justify-center">
        <AvatarFallback className="text-xs font-medium">JS</AvatarFallback>
      </Avatar>
    </div>
  );
}
