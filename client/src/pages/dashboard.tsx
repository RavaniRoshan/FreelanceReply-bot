/**
 * @fileoverview This file defines the Dashboard page, which displays a
 * summary of the user's automation performance and insights.
 */

import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ResponseChart from "@/components/dashboard/response-chart";
import LearningProgress from "@/components/dashboard/learning-progress";
import RecentActivity from "@/components/dashboard/recent-activity";
import TopTemplates from "@/components/dashboard/top-templates";
import IntegrationStatus from "@/components/dashboard/integration-status";
import { useToast } from "@/hooks/use-toast";

/**
 * The Dashboard page component.
 * @returns {JSX.Element} The rendered Dashboard page.
 */
export default function Dashboard() {
  const { toast } = useToast();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/analytics/summary"],
  });

  const handleCreateTemplate = () => {
    toast({
      title: "Create Template",
      description: "Redirecting to template creation...",
    });
    // Would navigate to template creation page
  };

  return (
    <>
      <Header
        title="Dashboard"
        description="Monitor your automation performance and insights"
        action={{
          label: "New Template",
          onClick: handleCreateTemplate,
        }}
      />
      
      <main className="flex-1 overflow-y-auto p-6" data-testid="dashboard-main">
        <MetricsCards data={summary as any} isLoading={summaryLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ResponseChart />
          <LearningProgress />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <TopTemplates />
        </div>
        
        <IntegrationStatus />
      </main>
    </>
  );
}
