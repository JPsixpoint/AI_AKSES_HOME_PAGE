import { BellIcon, SettingsIcon, ChevronDownIcon } from "lucide-react";
import { Logo } from "../ui/logo";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="bg-dark-lighter py-2 border-b border-dark-surface">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
            <SettingsIcon className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 bg-primary-light">
              <AvatarFallback className="text-sm">JS</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">John Smith</span>
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
