import { BellIcon, SettingsIcon, ChevronDownIcon, LogOutIcon, UsersIcon } from "lucide-react";
import { Logo } from "../ui/logo";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export function Header() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page happens automatically via auth context
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-dark-lighter py-2 border-b border-dark-surface">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Logo />
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
            <SettingsIcon className="h-5 w-5" />
          </Button>
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={toggleDropdown}
            >
              <Avatar className="h-8 w-8 bg-primary-light">
                <AvatarFallback className="text-sm">
                  {user && user.display_name ? user.display_name.substring(0, 2).toUpperCase() : (user ? user.username.substring(0, 2).toUpperCase() : 'U')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {user ? (user.display_name || user.username.split('@')[0]) : 'User'}
              </span>
              <ChevronDownIcon className={`h-4 w-4 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-dark-lighter border border-dark-surface z-50">
                <div className="py-1">
                  {user && user.is_admin && (
                    <button
                      onClick={() => { 
                        setLocation("/user-management");
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-dark-surface transition-colors"
                    >
                      <UsersIcon className="h-4 w-4 mr-2" />
                      User Management
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-dark-surface transition-colors"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
