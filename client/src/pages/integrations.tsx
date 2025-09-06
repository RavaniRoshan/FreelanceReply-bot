/**
 * @fileoverview This file defines the Integrations page, which allows users
 * to connect and manage their communication platforms.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { Integration } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const platformIcons = {
  Gmail: Mail,
  Slack: MessageSquare,
  Discord: MessageSquare,
  Telegram: Send,
};

const platformColors = {
  Gmail: "bg-red-500",
  Slack: "bg-blue-600",
  Discord: "bg-gray-800",
  Telegram: "bg-blue-500",
};

/**
 * The Integrations page component.
 * @returns {JSX.Element} The rendered Integrations page.
 */
export default function Integrations() {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["/api/integrations"],
  });

  const toggleIntegrationMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/integrations/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Success",
        description: "Integration status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update integration",
        variant: "destructive",
      });
    },
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest("POST", "/api/integrations", {
        platform,
        isActive: true,
        credentials: { connected: true },
        settings: { autoReply: true },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      setConnectingPlatform(null);
      toast({
        title: "Success",
        description: "Integration connected successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to connect integration",
        variant: "destructive",
      });
    },
  });

  const availablePlatforms = ["Gmail", "Slack", "Discord", "Telegram"];
  const connectedPlatforms = ((integrations as Integration[]) || []).map((i: Integration) => i.platform);
  const unconnectedPlatforms = availablePlatforms.filter(p => !connectedPlatforms.includes(p));

  const handleToggleIntegration = (integration: Integration) => {
    toggleIntegrationMutation.mutate({
      id: integration.id,
      isActive: !integration.isActive,
    });
  };

  const handleConnectPlatform = (platform: string) => {
    setConnectingPlatform(platform);
    // Simulate OAuth flow
    setTimeout(() => {
      createIntegrationMutation.mutate(platform);
    }, 1000);
  };

  return (
    <>
      <Header
        title="Integrations"
        description="Connect and manage your communication platforms"
      />
      
      <main className="flex-1 overflow-y-auto p-6" data-testid="integrations-main">
        {/* Connected Integrations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Connected Platforms</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading integrations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {((integrations as Integration[]) || []).map((integration: Integration) => {
                const Icon = platformIcons[integration.platform as keyof typeof platformIcons] || MessageSquare;
                const colorClass = platformColors[integration.platform as keyof typeof platformColors] || "bg-gray-500";
                
                return (
                  <Card key={integration.id} data-testid={`integration-${integration.platform.toLowerCase()}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.platform}</CardTitle>
                            <Badge variant={integration.isActive ? "default" : "secondary"}>
                              {integration.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={integration.isActive || false}
                          onCheckedChange={() => handleToggleIntegration(integration)}
                          data-testid={`toggle-${integration.platform.toLowerCase()}`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Auto-Reply:</span>
                          <span className="text-foreground">
                            {(integration.settings as any)?.autoReply ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Sync:</span>
                          <span className="text-foreground">
                            {integration.lastSync ? "2 hours ago" : "Never"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Messages Today:</span>
                          <span className="text-foreground">24</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4"
                        data-testid={`configure-${integration.platform.toLowerCase()}`}
                      >
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Integrations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {unconnectedPlatforms.map((platform) => {
              const Icon = platformIcons[platform as keyof typeof platformIcons] || MessageSquare;
              const colorClass = platformColors[platform as keyof typeof platformColors] || "bg-gray-500";
              
              return (
                <Card key={platform} className="hover:shadow-md transition-shadow" data-testid={`available-${platform.toLowerCase()}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">{platform}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Connect your {platform} account to automate responses
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleConnectPlatform(platform)}
                      data-testid={`connect-${platform.toLowerCase()}`}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Connection Dialog */}
        <Dialog open={!!connectingPlatform} onOpenChange={() => setConnectingPlatform(null)}>
          <DialogContent data-testid="connection-dialog">
            <DialogHeader>
              <DialogTitle>Connecting to {connectingPlatform}</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Redirecting to {connectingPlatform} for authentication...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
