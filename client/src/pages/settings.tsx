import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Brain, Bell, Shield, Zap, Clock, Target } from "lucide-react";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  timezone: z.string(),
  businessHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

const aiSettingsSchema = z.object({
  autoReplyEnabled: z.boolean(),
  confidenceThreshold: z.number().min(0).max(100),
  responseDelay: z.number().min(0),
  learningMode: z.boolean(),
  manualReviewRequired: z.boolean(),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  urgentInquiries: z.boolean(),
  dailyDigest: z.boolean(),
  weeklyReports: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AISettingsFormData = z.infer<typeof aiSettingsSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Form instances
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      timezone: "America/New_York",
      businessHours: {
        start: "09:00",
        end: "17:00",
      },
    },
  });

  const aiSettingsForm = useForm<AISettingsFormData>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      autoReplyEnabled: true,
      confidenceThreshold: 85,
      responseDelay: 30,
      learningMode: true,
      manualReviewRequired: false,
    },
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      urgentInquiries: true,
      dailyDigest: true,
      weeklyReports: false,
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PUT", "/api/settings/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save profile settings",
        variant: "destructive",
      });
    },
  });

  const saveAISettingsMutation = useMutation({
    mutationFn: async (data: AISettingsFormData) => {
      const response = await apiRequest("PUT", "/api/settings/ai", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save AI settings",
        variant: "destructive",
      });
    },
  });

  const saveNotificationMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      const response = await apiRequest("PUT", "/api/settings/notifications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    saveProfileMutation.mutate(data);
  };

  const onAISettingsSubmit = (data: AISettingsFormData) => {
    saveAISettingsMutation.mutate(data);
  };

  const onNotificationSubmit = (data: NotificationFormData) => {
    saveNotificationMutation.mutate(data);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "ai", label: "AI Settings", icon: Brain },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <>
      <Header
        title="Settings"
        description="Manage your account and automation preferences"
      />
      
      <main className="flex-1 overflow-y-auto p-6" data-testid="settings-main">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6" data-testid="settings-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card data-testid="profile-settings">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-timezone">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="businessHours.start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Hours Start</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-business-start" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="businessHours.end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Hours End</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-business-end" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={saveProfileMutation.isPending}
                      data-testid="save-profile"
                    >
                      {saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* AI Settings */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              <Card data-testid="ai-settings">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>AI Automation Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...aiSettingsForm}>
                    <form onSubmit={aiSettingsForm.handleSubmit(onAISettingsSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={aiSettingsForm.control}
                          name="autoReplyEnabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Auto-Reply</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Automatically respond to classified inquiries
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-auto-reply"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <Separator />

                        <FormField
                          control={aiSettingsForm.control}
                          name="confidenceThreshold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confidence Threshold: {field.value}%</FormLabel>
                              <p className="text-sm text-muted-foreground mb-3">
                                Only auto-reply when AI confidence is above this level
                              </p>
                              <FormControl>
                                <Slider
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  max={100}
                                  min={50}
                                  step={5}
                                  data-testid="slider-confidence"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={aiSettingsForm.control}
                          name="responseDelay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Response Delay (seconds)</FormLabel>
                              <p className="text-sm text-muted-foreground mb-3">
                                Add a human-like delay before sending responses
                              </p>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="300"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid="input-response-delay"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator />

                        <FormField
                          control={aiSettingsForm.control}
                          name="learningMode"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Learning Mode</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Allow AI to learn from successful responses
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-learning-mode"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={aiSettingsForm.control}
                          name="manualReviewRequired"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Manual Review Required</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Require manual approval before sending responses
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-manual-review"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={saveAISettingsMutation.isPending}
                        data-testid="save-ai-settings"
                      >
                        {saveAISettingsMutation.isPending ? "Saving..." : "Save AI Settings"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* AI Performance Insights */}
              <Card data-testid="ai-performance-insights">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>AI Performance Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-chart-3/10 rounded-lg">
                      <Zap className="h-8 w-8 text-chart-3 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">94.2%</p>
                      <p className="text-sm text-muted-foreground">Current Accuracy</p>
                    </div>
                    <div className="text-center p-4 bg-chart-2/10 rounded-lg">
                      <Clock className="h-8 w-8 text-chart-2 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">1.2s</p>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    </div>
                    <div className="text-center p-4 bg-chart-4/10 rounded-lg">
                      <Brain className="h-8 w-8 text-chart-4 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">1,247</p>
                      <p className="text-sm text-muted-foreground">Training Examples</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card data-testid="notification-settings">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-email-notifications"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={notificationForm.control}
                        name="urgentInquiries"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Urgent Inquiries</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Get notified immediately for urgent inquiries
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-urgent-inquiries"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="dailyDigest"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Daily Digest</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Summary of daily activity and performance
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-daily-digest"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="weeklyReports"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Weekly Reports</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Detailed analytics and improvement suggestions
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-weekly-reports"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={saveNotificationMutation.isPending}
                      data-testid="save-notifications"
                    >
                      {saveNotificationMutation.isPending ? "Saving..." : "Save Notification Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card data-testid="security-settings">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security & Privacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" data-testid="setup-2fa">
                        Setup
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-foreground">API Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Manage API keys for external integrations
                        </p>
                      </div>
                      <Button variant="outline" data-testid="manage-api-keys">
                        Manage Keys
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-foreground">Data Export</h4>
                        <p className="text-sm text-muted-foreground">
                          Download your templates and analytics data
                        </p>
                      </div>
                      <Button variant="outline" data-testid="export-data">
                        Export Data
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-foreground">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" data-testid="delete-account">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Information */}
              <Card data-testid="privacy-info">
                <CardHeader>
                  <CardTitle>Privacy & Data Handling</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Data Collection</h4>
                      <p className="text-muted-foreground">
                        We collect inquiry content, response templates, and performance metrics to improve AI accuracy.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Data Storage</h4>
                      <p className="text-muted-foreground">
                        All data is encrypted and stored securely. Customer inquiries are anonymized for AI training.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">AI Training</h4>
                      <p className="text-muted-foreground">
                        Your response patterns help improve classification but customer data remains private.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
