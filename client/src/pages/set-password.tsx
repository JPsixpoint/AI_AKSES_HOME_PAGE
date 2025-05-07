import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConcentricPattern } from "@/components/ui/concentric-pattern";
import { useToast } from "@/hooks/use-toast";

export default function SetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get token and username from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const usernameParam = params.get("username");
    
    if (tokenParam) setToken(tokenParam);
    if (usernameParam) setUsername(usernameParam);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          username,
          password,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to set password");
      }
      
      toast({
        title: "Password Set Successfully",
        description: "You can now log in with your new password.",
      });
      
      setLocation("/login");
    } catch (err: any) {
      console.error("Error setting password:", err);
      setError(err.message || "Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-black relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full opacity-15 z-0">
        <ConcentricPattern />
      </div>
      
      <div className="z-10 w-full max-w-md px-8 py-10 bg-card rounded-2xl shadow-2xl border border-border backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">AKSES</h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-center mb-6">Set Your Password</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-5 border border-red-900 bg-red-950/40">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200">Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                readOnly
                className="bg-card/50 border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                autoComplete="new-password"
                className="bg-card/50 border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                autoComplete="new-password"
                className="bg-card/50 border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 font-medium py-5" 
              disabled={isLoading}
            >
              {isLoading ? "Setting Password..." : "Set Password"}
            </Button>
            
            <div className="text-center mt-5">
              <span className="text-sm text-gray-400">
                Already know your password?{" "}
                <a 
                  href="/login" 
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/login");
                  }}
                >
                  Sign in
                </a>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 