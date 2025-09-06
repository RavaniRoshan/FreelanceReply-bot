/**
 * @fileoverview This file defines the LearningProgress component, which
 * displays the progress of the AI's learning.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lightbulb } from "lucide-react";

/**
 * The LearningProgress component displays the progress of the AI's learning.
 * It shows the progress for different categories, such as email
 * classification, response accuracy, and context understanding.
 * @returns {JSX.Element} The rendered LearningProgress component.
 */
export default function LearningProgress() {
  const progressData = [
    {
      label: "Email Classification",
      percentage: 87,
      color: "bg-chart-2",
      testId: "progress-classification",
    },
    {
      label: "Response Accuracy",
      percentage: 92,
      color: "bg-chart-3",
      testId: "progress-accuracy",
    },
    {
      label: "Context Understanding",
      percentage: 79,
      color: "bg-chart-4",
      testId: "progress-context",
    },
  ];

  return (
    <Card data-testid="learning-progress">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">AI Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item.label} data-testid={item.testId}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">{item.label}</span>
                <span className="text-muted-foreground" data-testid={`${item.testId}-value`}>
                  {item.percentage}%
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg" data-testid="learning-insight">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-chart-3 rounded-full flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Learning Insight</p>
              <p className="text-xs text-muted-foreground">
                Your AI is getting better at detecting urgent inquiries (+15% this week)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
