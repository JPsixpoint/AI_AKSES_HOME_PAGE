import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import OriginatorAvatar from "@/pages/originator-avatar";
import { ConvaiWidget } from "@/components/ai/convai-widget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/originator-avatar" component={OriginatorAvatar} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ConvaiWidget />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
