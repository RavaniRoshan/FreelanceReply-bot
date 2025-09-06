/**
 * @fileoverview This file defines the TopTemplates component, which displays a
 * list of the top-performing templates.
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { Template } from "@shared/schema";

/**
 * The TopTemplates component displays a list of the top-performing templates.
 * It shows the name, success rate, and usage of each template. It also has a
 * loading state and a button to create a new template.
 * @returns {JSX.Element} The rendered TopTemplates component.
 */
export default function TopTemplates() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const topTemplates = ((templates as Template[]) || [])
    .sort((a: Template, b: Template) => (b.successRate || 0) - (a.successRate || 0))
    .slice(0, 3);

  return (
    <Card data-testid="top-templates">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Top Templates</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="manage-templates">
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            </div>
          ) : (
            topTemplates.map((template: Template) => (
              <div 
                key={template.id}
                className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                data-testid={`template-${template.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground" data-testid={`template-${template.id}-name`}>
                    {template.name}
                  </h4>
                  <span className="text-xs text-chart-3 font-medium" data-testid={`template-${template.id}-success`}>
                    {template.successRate}% success
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2" data-testid={`template-${template.id}-usage`}>
                  Used {template.timesUsed} times this week
                </p>
                <Progress value={template.successRate} className="h-1" />
              </div>
            ))
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          data-testid="create-new-template"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Template
        </Button>
      </CardContent>
    </Card>
  );
}
