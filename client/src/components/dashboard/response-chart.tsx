/**
 * @fileoverview This file defines the ResponseChart component, which displays
 * a chart of the response performance.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

/**
 * The ResponseChart component displays a chart of the response performance.
 * It includes a select input to filter the chart by time. The chart itself
 * is a placeholder.
 * @returns {JSX.Element} The rendered ResponseChart component.
 */
export default function ResponseChart() {
  return (
    <Card data-testid="response-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Response Performance</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-40" data-testid="chart-time-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <div className="w-full h-full bg-muted/20 rounded-md flex items-center justify-center" data-testid="chart-placeholder">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-2 mx-auto" />
              <p className="text-sm text-muted-foreground">Performance Chart</p>
              <p className="text-xs text-muted-foreground">Real-time analytics visualization</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
