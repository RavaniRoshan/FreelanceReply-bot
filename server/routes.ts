import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTemplateSchema, 
  insertInquirySchema, 
  insertResponseSchema,
  insertIntegrationSchema 
} from "@shared/schema";
import { 
  classifyInquiry, 
  generateResponse, 
  analyzeSentiment, 
  improveTemplate 
} from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Demo user ID for MVP
  const DEMO_USER_ID = "jane.smith";

  // Templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const templates = await storage.getTemplates(user.id);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = insertTemplateSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Failed to create template", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.updateTemplate(id, req.body);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: "Failed to update template", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTemplate(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Inquiries routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const inquiries = await storage.getInquiries(user.id);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const templates = await storage.getTemplates(user.id);
      
      // Classify the inquiry using AI
      const classification = await classifyInquiry(
        req.body.subject || "",
        req.body.content,
        templates
      );

      const validatedData = insertInquirySchema.parse({
        ...req.body,
        userId: user.id,
        category: classification.category,
        priority: classification.priority,
        aiClassification: classification
      });
      
      const inquiry = await storage.createInquiry(validatedData);

      // Auto-generate response if template is suggested
      if (classification.suggestedTemplateId) {
        const template = await storage.getTemplate(classification.suggestedTemplateId);
        if (template) {
          const responseGeneration = await generateResponse(
            inquiry.content,
            template.content,
            {}
          );

          await storage.createResponse({
            inquiryId: inquiry.id,
            templateId: template.id,
            content: responseGeneration.content,
            isAutomated: true,
            wasModified: false
          });

          // Update template usage stats
          await storage.updateTemplate(template.id, {
            timesUsed: (template.timesUsed || 0) + 1
          });
        }
      }
      
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Failed to create inquiry", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Responses routes
  app.get("/api/responses", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const responses = await storage.getResponsesByUser(user.id);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  app.post("/api/responses", async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: "Failed to create response", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/responses/:id/feedback", async (req, res) => {
    try {
      const { id } = req.params;
      const { customerFeedback, success } = req.body;
      
      const response = await storage.updateResponse(id, {
        customerFeedback,
        success
      });
      
      if (!response) {
        return res.status(404).json({ message: "Response not found" });
      }
      
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: "Failed to update response feedback" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const analytics = await storage.getAnalytics(user.id, days);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const analytics = await storage.getAnalytics(user.id, 7);
      const templates = await storage.getTemplates(user.id);
      const responses = await storage.getResponsesByUser(user.id);
      
      const summary = {
        responseRate: analytics.length > 0 ? 
          (analytics.reduce((sum, a) => sum + (a.automatedResponses || 0), 0) / 
           analytics.reduce((sum, a) => sum + (a.totalInquiries || 0), 0) * 100) : 0,
        timeSaved: analytics.reduce((sum, a) => sum + (a.timeSaved || 0), 0),
        customerSatisfaction: analytics.length > 0 ?
          analytics.reduce((sum, a) => sum + (a.customerSatisfaction || 0), 0) / analytics.length / 20 : 0,
        activeTemplates: templates.filter(t => t.isActive).length,
        weeklyInquiries: analytics.reduce((sum, a) => sum + (a.totalInquiries || 0), 0),
        weeklyResponses: analytics.reduce((sum, a) => sum + (a.automatedResponses || 0), 0)
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  // Integrations routes
  app.get("/api/integrations", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const integrations = await storage.getIntegrations(user.id);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = insertIntegrationSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const integration = await storage.createIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      res.status(400).json({ message: "Failed to create integration", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/integrations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const integration = await storage.updateIntegration(id, req.body);
      
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      
      res.json(integration);
    } catch (error) {
      res.status(400).json({ message: "Failed to update integration" });
    }
  });

  // AI Learning routes
  app.post("/api/ai/classify", async (req, res) => {
    try {
      const { subject, content } = req.body;
      const user = await storage.getUserByUsername(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const templates = await storage.getTemplates(user.id);
      const classification = await classifyInquiry(subject, content, templates);
      
      res.json(classification);
    } catch (error) {
      res.status(500).json({ message: "Failed to classify inquiry" });
    }
  });

  app.post("/api/ai/generate-response", async (req, res) => {
    try {
      const { inquiryContent, templateId, variables } = req.body;
      const template = await storage.getTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      const response = await generateResponse(inquiryContent, template.content, variables);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  app.post("/api/ai/improve-template/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      const responses = await storage.getResponsesByUser(template.userId);
      const templateResponses = responses.filter(r => r.templateId === id);
      
      const feedbackData = templateResponses.map(r => ({
        success: r.success || false,
        customerFeedback: r.customerFeedback || undefined,
        responseTime: 0 // Would calculate from actual data
      }));
      
      const improvement = await improveTemplate(template.content, feedbackData);
      res.json(improvement);
    } catch (error) {
      res.status(500).json({ message: "Failed to improve template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
