/**
 * @fileoverview This file defines all the API routes for the application.
 * It registers all the endpoints for templates, inquiries, responses, analytics,
 * integrations, and AI services.
 */

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

/**
 * Registers all the API routes for the application.
 * @param {Express} app - The Express application instance.
 * @returns {Promise<Server>} A promise that resolves to an HTTP server instance.
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Demo user ID for MVP
  const DEMO_USER_ID = "jane.smith";

  // --- Templates routes ---

  /**
   * @route GET /api/templates
   * @description Fetches all templates for the demo user.
   * @returns {Response} A JSON response with the list of templates.
   */
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

  /**
   * @route POST /api/templates
   * @description Creates a new template for the demo user.
   * @param {Request} req - The request object, containing the template data in the body.
   * @returns {Response} A JSON response with the newly created template.
   */
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

  /**
   * @route PUT /api/templates/:id
   * @description Updates an existing template.
   * @param {Request} req - The request object, containing the template ID in the params and the update data in the body.
   * @returns {Response} A JSON response with the updated template.
   */
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

  /**
   * @route DELETE /api/templates/:id
   * @description Deletes a template.
   * @param {Request} req - The request object, containing the template ID in the params.
   * @returns {Response} A 204 No Content response on success.
   */
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

  // --- Inquiries routes ---

  /**
   * @route GET /api/inquiries
   * @description Fetches all inquiries for the demo user.
   * @returns {Response} A JSON response with the list of inquiries.
   */
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

  /**
   * @route POST /api/inquiries
   * @description Creates a new inquiry, classifies it using AI, and generates an automated response if applicable.
   * @param {Request} req - The request object, containing the inquiry data in the body.
   * @returns {Response} A JSON response with the newly created inquiry.
   */
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

  // --- Responses routes ---

  /**
   * @route GET /api/responses
   * @description Fetches all responses for the demo user.
   * @returns {Response} A JSON response with the list of responses.
   */
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

  /**
   * @route POST /api/responses
   * @description Creates a new response.
   * @param {Request} req - The request object, containing the response data in the body.
   * @returns {Response} A JSON response with the newly created response.
   */
  app.post("/api/responses", async (req, res) => {
    try {
      const validatedData = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: "Failed to create response", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  /**
   * @route PUT /api/responses/:id/feedback
   * @description Updates a response with customer feedback.
   * @param {Request} req - The request object, containing the response ID in the params and feedback data in the body.
   * @returns {Response} A JSON response with the updated response.
   */
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

  // --- Analytics routes ---

  /**
   * @route GET /api/analytics
   * @description Fetches analytics data for the demo user.
   * @param {Request} req - The request object, optionally containing the number of days for the analytics period in the query.
   * @returns {Response} A JSON response with the analytics data.
   */
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

  /**
   * @route GET /api/analytics/summary
   * @description Fetches a summary of analytics data for the demo user.
   * @returns {Response} A JSON response with the analytics summary.
   */
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

  // --- Integrations routes ---

  /**
   * @route GET /api/integrations
   * @description Fetches all integrations for the demo user.
   * @returns {Response} A JSON response with the list of integrations.
   */
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

  /**
   * @route POST /api/integrations
   * @description Creates a new integration for the demo user.
   * @param {Request} req - The request object, containing the integration data in the body.
   * @returns {Response} A JSON response with the newly created integration.
   */
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

  /**
   * @route PUT /api/integrations/:id
   * @description Updates an existing integration.
   * @param {Request} req - The request object, containing the integration ID in the params and the update data in the body.
   * @returns {Response} A JSON response with the updated integration.
   */
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

  // --- AI Learning routes ---

  /**
   * @route POST /api/ai/classify
   * @description Classifies an inquiry using AI.
   * @param {Request} req - The request object, containing the inquiry subject and content in the body.
   * @returns {Response} A JSON response with the classification result.
   */
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

  /**
   * @route POST /api/ai/generate-response
   * @description Generates a response to an inquiry using a template and AI.
   * @param {Request} req - The request object, containing the inquiry content, template ID, and variables in the body.
   * @returns {Response} A JSON response with the generated response.
   */
  app.post("/api/ai/generate-response", async (req,.res) => {
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

  /**
   * @route POST /api/ai/improve-template/:id
   * @description Improves a template based on feedback from previous responses.
   * @param {Request} req - The request object, containing the template ID in the params.
   * @returns {Response} A JSON response with the suggested improvement.
   */
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
