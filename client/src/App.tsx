import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Templates from "@/pages/templates";
import AILearning from "@/pages/ai-learning";
import Integrations from "@/pages/integrations";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/templates" component={Templates} />
          <Route path="/ai-learning" component={AILearning} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={() => <DashboardLayout />} />
      <Route path="/templates" component={() => <DashboardLayout />} />
      <Route path="/ai-learning" component={() => <DashboardLayout />} />
      <Route path="/integrations" component={() => <DashboardLayout />} />
      <Route path="/settings" component={() => <DashboardLayout />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
