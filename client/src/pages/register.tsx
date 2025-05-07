import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConcentricPattern } from "@/components/ui/concentric-pattern";
import { Separator } from "@/components/ui/separator";

export default function Register() {
  const { user, register, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, password);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftRegister = () => {
    window.location.href = "/api/auth/microsoft";
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
        
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        
        {(error || validationError) && (
          <Alert variant="destructive" className="mb-5 border border-red-900 bg-red-950/40">
            <AlertDescription>{error || validationError}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleMicrosoftRegister}
          className="w-full flex items-center justify-center gap-2 mb-4 transition-all duration-300 hover:bg-slate-200 hover:text-slate-900"
          variant="outline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z"></path>
            <path fill="#f35325" d="M1 1h10v10H1z"></path>
            <path fill="#81bc06" d="M12 1h10v10H12z"></path>
            <path fill="#05a6f0" d="M1 12h10v10H1z"></path>
            <path fill="#ffba08" d="M12 12h10v10H12z"></path>
          </svg>
          Sign up with Microsoft
        </Button>
        
        <div className="relative my-6">
          <Separator className="opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-3 text-muted-foreground text-sm font-medium">or</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} onChange={clearError}>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-200">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                autoComplete="username"
                className="bg-card border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                autoComplete="new-password"
                className="bg-card border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
              />
              <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters long</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                className="bg-card border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 font-medium py-5 mt-4" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            <div className="text-center mt-5">
              <span className="text-sm text-gray-400">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/login");
                  }}
                >
                  Login
                </a>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 