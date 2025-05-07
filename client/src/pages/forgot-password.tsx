import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConcentricPattern } from "@/components/ui/concentric-pattern";

export default function ForgotPassword() {
  const { forgotPassword, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await forgotPassword(username);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
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
        
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        
        {isSubmitted ? (
          <div className="text-center">
            <Alert className="mb-6 border border-indigo-900 bg-indigo-950/40">
              <AlertDescription className="text-gray-200">
                If an account with that username exists, we've sent a password reset link to the associated email.
              </AlertDescription>
            </Alert>
            
            <Button
              className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 font-medium py-5 w-full"
              onClick={() => setLocation("/login")}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-5 border border-red-900 bg-red-950/40">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <p className="text-gray-300 mb-6 text-center">
              Enter your username and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} onChange={clearError}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-200">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                    className="bg-card border-muted/60 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 font-medium py-5 mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                
                <div className="text-center mt-5">
                  <a 
                    href="/login" 
                    className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
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