/**
 * @fileoverview This file defines the RecentActivity component, which displays
 * a list of recent activities.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Brain, Edit, Plug } from "lucide-react";

/**
 * The RecentActivity component displays a list of recent activities. It shows
 * activities such as auto-replies, AI learning events, template updates, and
 * integration activations.
 * @returns {JSX.Element} The rendered RecentActivity component.
 */
export default function RecentActivity() {
  const activities = [
    {
      icon: Check,
      iconColor: "text-chart-3",
      iconBg: "bg-chart-3/10",
      title: "Auto-replied to project inquiry from Sarah Johnson",
      subtitle: "Used template: \"Project Requirements Response\" • 2 minutes ago",
      status: "Success",
      statusColor: "bg-chart-3/10 text-chart-3",
      testId: "activity-auto-reply",
    },
    {
      icon: Brain,
      iconColor: "text-chart-2",
      iconBg: "bg-chart-2/10",
      title: "AI learned new pattern from pricing inquiry",
      subtitle: "Improved classification accuracy • 15 minutes ago",
      status: "Learning",
      statusColor: "bg-chart-2/10 text-chart-2",
      testId: "activity-learning",
    },
    {
      icon: Edit,
      iconColor: "text-chart-4",
      iconBg: "bg-chart-4/10",
      title: "Template \"Availability Inquiry\" updated",
      subtitle: "Manual refinement based on client feedback • 1 hour ago",
      status: "Updated",
      statusColor: "bg-chart-4/10 text-chart-4",
      testId: "activity-template-update",
    },
    {
      icon: Plug,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      title: "Gmail integration activated",
      subtitle: "Now monitoring jane.smith@email.com • 3 hours ago",
      status: "Connected",
      statusColor: "bg-primary/10 text-primary",
      testId: "activity-integration",
    },
  ];

  return (
    <Card data-testid="recent-activity">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="view-all-activities">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div 
                key={activity.testId}
                className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                data-testid={activity.testId}
              >
                <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`${activity.iconColor} h-4 w-4`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground" data-testid={`${activity.testId}-title`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`${activity.testId}-subtitle`}>
                    {activity.subtitle}
                  </p>
                </div>
                <span 
                  className={`px-2 py-1 text-xs rounded-full ${activity.statusColor}`}
                  data-testid={`${activity.testId}-status`}
                >
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
