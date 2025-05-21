import { BellIcon, SettingsIcon, ChevronDownIcon, BookOpenIcon } from "lucide-react";
import { Logo } from "../ui/logo";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function Header() {
  // Function to open the onboarding tab
  const openOnboardingTab = () => {
    // Access the global window function that opens tabs
    if ((window as any).openTab) {
      (window as any).openTab("Onboarding", "Onboarding");
    }
  };

  return (
    <header className="bg-dark-lighter py-2 border-b border-dark-surface">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Logo />
        </div>
        
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={openOnboardingTab}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <BookOpenIcon className="h-5 w-5 mr-1" />
                  <span>Onboarding</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Explore AKSES platform capabilities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
