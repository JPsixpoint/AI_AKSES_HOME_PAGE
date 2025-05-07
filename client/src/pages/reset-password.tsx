import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConcentricPattern } from "@/components/ui/concentric-pattern";

export default function ResetPassword() {
  const { resetPassword, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [location, setLocation] = useLocation();

  // Extract token from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const usernameParam = params.get("username");
    
    if (tokenParam) {
      setToken(tokenParam);
    }
    
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, []);

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
    
    if (!token || !username) {
      setValidationError("Missing token or username");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(token, username, password);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full opacity-10 z-0">
        <ConcentricPattern />
      </div>
      
      <div className="z-10 w-full max-w-md px-8 py-10 bg-card rounded-lg shadow-xl border border-border">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-primary">AKSES</h1>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        
        {isSubmitted ? (
          <div className="text-center">
            <Alert className="mb-4">
              <AlertDescription>
                Your password has been reset successfully. You can now login with your new password.
              </AlertDescription>
            </Alert>
            
            <Button
              className="mt-4"
              onClick={() => setLocation("/login")}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            {(error || validationError) && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error || validationError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} onChange={clearError}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                    readOnly={!!username}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="token">Reset Token</Label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your reset token"
                    required
                    readOnly={!!token}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    autoComplete="new-password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    autoComplete="new-password"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
                
                <div className="text-center mt-4">
                  <a 
                    href="/login" 
                    className="text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation("/login");
                    }}
                  >
                    Back to Login
                  </a>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 