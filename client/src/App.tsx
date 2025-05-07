import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import SetPassword from "@/pages/set-password";
import UserManagement from "@/pages/user-management";
import OriginatorAvatar from "@/pages/originator-avatar";
import React from "react";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <Component {...rest} /> : <Login />;
}

function AdminRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Login />;
  }
  
  return user.is_admin ? <Component {...rest} /> : <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/set-password" component={SetPassword} />
      <Route path="/">
        {() => <ProtectedRoute component={Home} path="/" />}
      </Route>
      <Route path="/originator-avatar">
        {() => <ProtectedRoute component={OriginatorAvatar} path="/originator-avatar" />}
      </Route>
      <Route path="/user-management">
        {() => <AdminRoute component={UserManagement} path="/user-management" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
