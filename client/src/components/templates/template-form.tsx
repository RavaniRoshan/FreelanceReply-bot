/**
 * @fileoverview This file defines the TemplateForm component, which is used
 * to create and edit templates.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertTemplateSchema, Template } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertTemplateSchema.omit({ userId: true }).extend({
  variables: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

/**
 * The props for the TemplateForm component.
 */
interface TemplateFormProps {
  /**
   * The template to edit, or null if creating a new template.
   */
  template?: Template | null;
  /**
   * A callback to be called when the form is successfully submitted.
   */
  onSuccess: () => void;
  /**
   * A callback to be called when the form is cancelled.
   */
  onCancel: () => void;
}

/**
 * The TemplateForm component is used to create and edit templates. It includes
 * a form with fields for the template's name, category, subject, content,
 * and variables.
 * @param {TemplateFormProps} props - The props for the component.
 * @returns {JSX.Element} The rendered TemplateForm component.
 */
export default function TemplateForm({ template, onSuccess, onCancel }: TemplateFormProps) {
  const { toast } = useToast();
  const isEditing = !!template;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      category: template?.category || "",
      subject: template?.subject || "",
      content: template?.content || "",
      variables: template?.variables ? (template.variables as string[]).join(", ") : "",
      isActive: template?.isActive ?? true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        variables: data.variables ? data.variables.split(",").map(v => v.trim()).filter(Boolean) : [],
      };
      const response = await apiRequest("POST", "/api/templates", payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        variables: data.variables ? data.variables.split(",").map(v => v.trim()).filter(Boolean) : [],
      };
      const response = await apiRequest("PUT", `/api/templates/${template!.id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="template-form">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Project Inquiry Response" {...field} data-testid="input-template-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="pricing">Pricing</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Line (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Re: Your Project Inquiry" {...field} value={field.value || ''} data-testid="input-subject" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your template content here..."
                  className="min-h-32"
                  {...field}
                  data-testid="textarea-content"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variables"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variables (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., projectType, timeline, budget (comma-separated)" 
                  {...field} 
                  data-testid="input-variables"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} data-testid="button-submit">
            {isPending ? "Saving..." : isEditing ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
