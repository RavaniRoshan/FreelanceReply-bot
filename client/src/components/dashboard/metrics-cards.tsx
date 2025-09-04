import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Reply, Clock, Star, FileText, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
  data?: {
    responseRate: number;
    timeSaved: number;
    customerSatisfaction: number;
    activeTemplates: number;
  };
  isLoading: boolean;
}

export default function MetricsCards({ data, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-cards-loading">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Response Rate",
      value: `${(data?.responseRate || 0).toFixed(1)}%`,
      change: "+5.2% from last week",
      icon: Reply,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      testId: "metric-response-rate",
    },
    {
      title: "Time Saved",
      value: `${(data?.timeSaved || 0).toFixed(1)} hrs`,
      change: "+3.1 hrs this week",
      icon: Clock,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      testId: "metric-time-saved",
    },
    {
      title: "Customer Satisfaction",
      value: `${(data?.customerSatisfaction || 0).toFixed(1)}/5`,
      change: "+0.3 from last month",
      icon: Star,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      testId: "metric-satisfaction",
    },
    {
      title: "Active Templates",
      value: `${data?.activeTemplates || 0}`,
      change: "2 updated today",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      testId: "metric-templates",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-cards">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="metric-card" data-testid={metric.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`${metric.testId}-value`}>
                    {metric.value}
                  </p>
                  <p className={`text-xs mt-1 flex items-center ${metric.color}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${metric.color} text-lg h-5 w-5`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
