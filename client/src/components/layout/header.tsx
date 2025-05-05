import { BellIcon, SettingsIcon, ChevronDownIcon, HomeIcon, PieChartIcon } from "lucide-react";
import { Logo } from "../ui/logo";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-dark-lighter py-2 border-b border-dark-surface">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Logo />
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className={`flex items-center space-x-1 cursor-pointer ${location === "/" ? "text-primary-light" : "text-muted-foreground hover:text-foreground"} transition-colors`}>
                <HomeIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Home</span>
              </div>
            </Link>
            <Link href="/sixpoint-deals">
              <div className={`flex items-center space-x-1 cursor-pointer ${location === "/sixpoint-deals" ? "text-primary-light" : "text-muted-foreground hover:text-foreground"} transition-colors`}>
                <PieChartIcon className="h-4 w-4" />
                <span className="text-sm font-medium">SixPoint Deals</span>
              </div>
            </Link>
          </nav>
        </div>
        
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
