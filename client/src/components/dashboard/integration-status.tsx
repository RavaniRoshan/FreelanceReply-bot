import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Integration } from "@shared/schema";

export default function IntegrationStatus() {
  const { data: integrations, isLoading } = useQuery({
    queryKey: ["/api/integrations"],
  });

  const platformInfo = {
    Gmail: { icon: "🟡", color: "bg-red-500" },
    Slack: { icon: "💙", color: "bg-blue-600" },
    Discord: { icon: "⚫", color: "bg-gray-800" },
    Telegram: { icon: "🔵", color: "bg-blue-500" },
  };

  const availablePlatforms = ["Gmail", "Slack", "Discord", "Telegram"];
  const connectedPlatforms = ((integrations as Integration[]) || []).filter((i: Integration) => i.isActive);
  const unconnectedPlatforms = availablePlatforms.filter(
    platform => !connectedPlatforms.find((i: Integration) => i.platform === platform)
  );

  return (
    <Card data-testid="integration-status">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Integration Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connected Integrations */}
          {connectedPlatforms.map((integration: Integration) => {
            const info = platformInfo[integration.platform as keyof typeof platformInfo];
            return (
              <div 
                key={integration.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                data-testid={`integration-${integration.platform.toLowerCase()}`}
              >
                <div className={`w-8 h-8 ${info?.color} rounded flex items-center justify-center text-white`}>
                  {integration.platform.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{integration.platform}</p>
                  <Badge variant="outline" className="text-xs text-chart-3 border-chart-3">
                    Connected
                  </Badge>
                </div>
                <div className="w-3 h-3 bg-chart-3 rounded-full" data-testid={`${integration.platform.toLowerCase()}-status`}></div>
              </div>
            );
          })}

          {/* Available Integrations */}
          {unconnectedPlatforms.map((platform) => {
            const info = platformInfo[platform as keyof typeof platformInfo];
            return (
              <div 
                key={platform}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                data-testid={`integration-${platform.toLowerCase()}`}
              >
                <div className={`w-8 h-8 ${info?.color} rounded flex items-center justify-center text-white`}>
                  {platform.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{platform}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-primary text-xs hover:text-primary/80"
                  data-testid={`connect-${platform.toLowerCase()}`}
                >
                  Connect
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
