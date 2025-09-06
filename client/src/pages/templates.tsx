/**
 * @fileoverview This file defines the Templates page, which allows users to
 * manage their automated response templates.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Play, Pause } from "lucide-react";
import { Template } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TemplateForm from "@/components/templates/template-form";

/**
 * The Templates page component.
 * @returns {JSX.Element} The rendered Templates page.
 */
export default function Templates() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const toggleTemplateMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/templates/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    },
  });

  const handleCreateTemplate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleToggleTemplate = (template: Template) => {
    toggleTemplateMutation.mutate({
      id: template.id,
      isActive: !template.isActive,
    });
  };

  return (
    <>
      <Header
        title="Templates"
        description="Manage your automated response templates"
        action={{
          label: "New Template",
          onClick: handleCreateTemplate,
        }}
      />
      
      <main className="flex-1 overflow-y-auto p-6" data-testid="templates-main">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {((templates as Template[]) || []).map((template: Template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow" data-testid={`template-card-${template.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium" data-testid={`template-name-${template.id}`}>
                        {template.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.category}
                        </Badge>
                        <Badge variant={template.isActive ? "outline" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleTemplate(template)}
                      data-testid={`toggle-template-${template.id}`}
                    >
                      {template.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`template-content-${template.id}`}>
                    {template.content}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Success Rate:</span>
                      <span className="ml-1 text-chart-3 font-semibold">{template.successRate}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Times Used:</span>
                      <span className="ml-1">{template.timesUsed}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="flex-1"
                      data-testid={`edit-template-${template.id}`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`delete-template-${template.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Template Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <TemplateForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Template Dialog */}
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
            </DialogHeader>
            <TemplateForm
              template={editingTemplate}
              onSuccess={() => setEditingTemplate(null)}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
