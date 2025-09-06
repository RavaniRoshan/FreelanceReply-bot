/**
 * @fileoverview This file defines the AI Learning page, which displays
 * metrics and information about the performance of the AI model.
 */

import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Zap, Target } from "lucide-react";

/**
 * The AI Learning page component.
 * @returns {JSX.Element} The rendered AI Learning page.
 */
export default function AILearning() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics", { days: 30 }],
  });

  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const learningMetrics = [
    {
      title: "Classification Accuracy",
      value: 87,
      improvement: "+12%",
      icon: Target,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Response Quality",
      value: 92,
      improvement: "+8%",
      icon: Zap,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Learning Speed",
      value: 78,
      improvement: "+15%",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <>
      <Header
        title="AI Learning"
        description="Monitor and improve your AI's performance over time"
      />
      
      <main className="flex-1 overflow-y-auto p-6" data-testid="ai-learning-main">
        {/* Learning Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {learningMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} data-testid={`metric-${metric.title.toLowerCase().replace(' ', '-')}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}%</p>
                      <p className={`text-xs mt-1 flex items-center ${metric.color}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {metric.improvement} this month
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`${metric.color} h-5 w-5`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Learning Progress */}
          <Card data-testid="learning-progress-details">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Email Classification</span>
                    <span className="text-sm text-muted-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Improved at identifying project vs pricing inquiries
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Response Accuracy</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Better at matching templates to inquiry types
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Context Understanding</span>
                    <span className="text-sm text-muted-foreground">79%</span>
                  </div>
                  <Progress value={79} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Learning to understand urgency and tone
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Variable Extraction</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Better at identifying key information in inquiries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Improvements */}
          <Card data-testid="recent-improvements">
            <CardHeader>
              <CardTitle>Recent Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-chart-3 pl-4">
                  <h4 className="text-sm font-medium text-foreground">Urgency Detection</h4>
                  <p className="text-xs text-muted-foreground">
                    AI learned to identify urgent keywords like "ASAP", "urgent", and deadline mentions
                  </p>
                  <Badge variant="outline" className="mt-1 text-chart-3 border-chart-3">
                    +15% accuracy
                  </Badge>
                </div>

                <div className="border-l-4 border-chart-2 pl-4">
                  <h4 className="text-sm font-medium text-foreground">Budget Recognition</h4>
                  <p className="text-xs text-muted-foreground">
                    Improved at extracting budget information from pricing inquiries
                  </p>
                  <Badge variant="outline" className="mt-1 text-chart-2 border-chart-2">
                    +22% extraction rate
                  </Badge>
                </div>

                <div className="border-l-4 border-chart-4 pl-4">
                  <h4 className="text-sm font-medium text-foreground">Tone Adaptation</h4>
                  <p className="text-xs text-muted-foreground">
                    Learning to match response tone to inquiry formality level
                  </p>
                  <Badge variant="outline" className="mt-1 text-chart-4 border-chart-4">
                    +8% satisfaction
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Data */}
        <Card data-testid="training-data">
          <CardHeader>
            <CardTitle>Training Data Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <p className="text-sm text-muted-foreground">Total Inquiries Processed</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">892</p>
                <p className="text-sm text-muted-foreground">Successful Classifications</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Manual Corrections</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">4.2</p>
                <p className="text-sm text-muted-foreground">Avg Customer Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
