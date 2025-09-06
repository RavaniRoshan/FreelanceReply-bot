/**
 * @fileoverview This file defines the storage interface and an in-memory
 * implementation of that interface. This is used to store and retrieve all
 * the application's data.
 */

import { 
  type User, 
  type InsertUser,
  type Template,
  type InsertTemplate,
  type Inquiry,
  type InsertInquiry,
  type Response,
  type InsertResponse,
  type Integration,
  type InsertIntegration,
  type Analytics,
  type InsertAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * Interface for storage operations.
 */
export interface IStorage {
  // User operations
  /**
   * Gets a user by their ID.
   * @param {string} id - The ID of the user to get.
   * @returns {Promise<User | undefined>} A promise that resolves to the user, or undefined if not found.
   */
  getUser(id: string): Promise<User | undefined>;
  /**
   * Gets a user by their username.
   * @param {string} username - The username of the user to get.
   * @returns {Promise<User | undefined>} A promise that resolves to the user, or undefined if not found.
   */
  getUserByUsername(username: string): Promise<User | undefined>;
  /**
   * Creates a new user.
   * @param {InsertUser} user - The user to create.
   * @returns {Promise<User>} A promise that resolves to the created user.
   */
  createUser(user: InsertUser): Promise<User>;

  // Template operations
  /**
   * Gets all templates for a user.
   * @param {string} userId - The ID of the user to get templates for.
   * @returns {Promise<Template[]>} A promise that resolves to a list of templates.
   */
  getTemplates(userId: string): Promise<Template[]>;
  /**
   * Gets a template by its ID.
   * @param {string} id - The ID of the template to get.
   * @returns {Promise<Template | undefined>} A promise that resolves to the template, or undefined if not found.
   */
  getTemplate(id: string): Promise<Template | undefined>;
  /**
   * Creates a new template.
   * @param {InsertTemplate} template - The template to create.
   * @returns {Promise<Template>} A promise that resolves to the created template.
   */
  createTemplate(template: InsertTemplate): Promise<Template>;
  /**
   * Updates a template.
   * @param {string} id - The ID of the template to update.
   * @param {Partial<Template>} template - The template updates.
   * @returns {Promise<Template | undefined>} A promise that resolves to the updated template, or undefined if not found.
   */
  updateTemplate(id: string, template: Partial<Template>): Promise<Template | undefined>;
  /**
   * Deletes a template.
   * @param {string} id - The ID of the template to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the template was deleted, false otherwise.
   */
  deleteTemplate(id: string): Promise<boolean>;

  // Inquiry operations
  /**
   * Gets all inquiries for a user.
   * @param {string} userId - The ID of the user to get inquiries for.
   * @returns {Promise<Inquiry[]>} A promise that resolves to a list of inquiries.
   */
  getInquiries(userId: string): Promise<Inquiry[]>;
  /**
   * Gets an inquiry by its ID.
   * @param {string} id - The ID of the inquiry to get.
   * @returns {Promise<Inquiry | undefined>} A promise that resolves to the inquiry, or undefined if not found.
   */
  getInquiry(id: string): Promise<Inquiry | undefined>;
  /**
   * Creates a new inquiry.
   * @param {InsertInquiry} inquiry - The inquiry to create.
   * @returns {Promise<Inquiry>} A promise that resolves to the created inquiry.
   */
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;

  // Response operations
  /**
   * Gets all responses for an inquiry.
   * @param {string} inquiryId - The ID of the inquiry to get responses for.
   * @returns {Promise<Response[]>} A promise that resolves to a list of responses.
   */
  getResponses(inquiryId: string): Promise<Response[]>;
  /**
   * Gets all responses for a user.
   * @param {string} userId - The ID of the user to get responses for.
   * @returns {Promise<Response[]>} A promise that resolves to a list of responses.
   */
  getResponsesByUser(userId: string): Promise<Response[]>;
  /**
   * Creates a new response.
   * @param {InsertResponse} response - The response to create.
   * @returns {Promise<Response>} A promise that resolves to the created response.
   */
  createResponse(response: InsertResponse): Promise<Response>;
  /**
   * Updates a response.
   * @param {string} id - The ID of the response to update.
   * @param {Partial<Response>} response - The response updates.
   * @returns {Promise<Response | undefined>} A promise that resolves to the updated response, or undefined if not found.
   */
  updateResponse(id: string, response: Partial<Response>): Promise<Response | undefined>;

  // Integration operations
  /**
   * Gets all integrations for a user.
   * @param {string} userId - The ID of the user to get integrations for.
   * @returns {Promise<Integration[]>} A promise that resolves to a list of integrations.
   */
  getIntegrations(userId: string): Promise<Integration[]>;
  /**
   * Gets an integration by its ID.
   * @param {string} id - The ID of the integration to get.
   * @returns {Promise<Integration | undefined>} A promise that resolves to the integration, or undefined if not found.
   */
  getIntegration(id: string): Promise<Integration | undefined>;
  /**
   * Creates a new integration.
   * @param {InsertIntegration} integration - The integration to create.
   * @returns {Promise<Integration>} A promise that resolves to the created integration.
   */
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  /**
   * Updates an integration.
   * @param {string} id - The ID of the integration to update.
   * @param {Partial<Integration>} integration - The integration updates.
   * @returns {Promise<Integration | undefined>} A promise that resolves to the updated integration, or undefined if not found.
   */
  updateIntegration(id: string, integration: Partial<Integration>): Promise<Integration | undefined>;

  // Analytics operations
  /**
   * Gets analytics data for a user.
   * @param {string} userId - The ID of the user to get analytics for.
   * @param {number} [days] - The number of days to get analytics for.
   * @returns {Promise<Analytics[]>} A promise that resolves to a list of analytics data.
   */
  getAnalytics(userId: string, days?: number): Promise<Analytics[]>;
  /**
   * Creates new analytics data.
   * @param {InsertAnalytics} analytics - The analytics data to create.
   * @returns {Promise<Analytics>} A promise that resolves to the created analytics data.
   */
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  /**
   * Updates analytics data.
   * @param {string} id - The ID of the analytics data to update.
   * @param {Partial<Analytics>} analytics - The analytics data updates.
   * @returns {Promise<Analytics | undefined>} A promise that resolves to the updated analytics data, or undefined if not found.
   */
  updateAnalytics(id: string, analytics: Partial<Analytics>): Promise<Analytics | undefined>;
}

/**
 * In-memory implementation of the IStorage interface.
 */
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private templates: Map<string, Template>;
  private inquiries: Map<string, Inquiry>;
  private responses: Map<string, Response>;
  private integrations: Map<string, Integration>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.inquiries = new Map();
    this.responses = new Map();
    this.integrations = new Map();
    this.analytics = new Map();

    // Initialize with demo user and data
    this.initializeDemoData();
  }

  /**
   * Initializes the storage with demo data.
   * @private
   */
  private async initializeDemoData() {
    // Create demo user
    const demoUser = await this.createUser({
      username: "jane.smith",
      password: "password123"
    });

    // Create demo templates
    await this.createTemplate({
      userId: demoUser.id,
      name: "Project Inquiry",
      category: "project",
      subject: "Re: Project Inquiry",
      content: "Thank you for your interest in my services. I'd be happy to discuss your project requirements in detail. Could you please provide more information about your timeline and budget?",
      variables: ["projectType", "timeline", "budget"],
      successRate: 96,
      timesUsed: 34
    });

    await this.createTemplate({
      userId: demoUser.id,
      name: "Pricing Request",
      category: "pricing",
      subject: "Re: Pricing Information",
      content: "Thank you for reaching out. I'd be happy to provide a quote for your project. My rates vary based on project complexity and timeline. Let's schedule a brief call to discuss your needs.",
      variables: ["serviceType", "projectScope"],
      successRate: 89,
      timesUsed: 28
    });

    await this.createTemplate({
      userId: demoUser.id,
      name: "Availability Check",
      category: "availability",
      subject: "Re: Availability Inquiry",
      content: "Thanks for your message. I currently have availability starting next week. I'd love to learn more about your project to see if we're a good fit. When would be convenient for a quick call?",
      variables: ["startDate", "projectDuration"],
      successRate: 84,
      timesUsed: 19
    });

    // Create demo integrations
    await this.createIntegration({
      userId: demoUser.id,
      platform: "Gmail",
      isActive: true,
      credentials: { email: "jane.smith@email.com" },
      settings: { autoReply: true, categories: ["project", "pricing"] }
    });

    await this.createIntegration({
      userId: demoUser.id,
      platform: "Slack",
      isActive: true,
      credentials: { workspace: "freelance-team" },
      settings: { autoReply: false }
    });

    // Create demo analytics
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      await this.createAnalytics({
        userId: demoUser.id,
        totalInquiries: Math.floor(Math.random() * 10) + 5,
        automatedResponses: Math.floor(Math.random() * 8) + 3,
        manualResponses: Math.floor(Math.random() * 3) + 1,
        averageResponseTime: Math.floor(Math.random() * 300) + 60,
        customerSatisfaction: Math.floor(Math.random() * 20) + 80,
        timeSaved: Math.floor(Math.random() * 120) + 60
      });
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Template operations
  async getTemplates(userId: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.userId === userId
    );
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const now = new Date();
    const template: Template = { 
      ...insertTemplate, 
      id,
      createdAt: now,
      updatedAt: now,
      isActive: insertTemplate.isActive ?? true,
      successRate: insertTemplate.successRate ?? 0,
      timesUsed: insertTemplate.timesUsed ?? 0,
      variables: insertTemplate.variables ?? [],
      subject: insertTemplate.subject ?? null
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { 
      ...template, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Inquiry operations
  async getInquiries(userId: string): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(
      (inquiry) => inquiry.userId === userId
    );
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date(),
      category: insertInquiry.category ?? null,
      priority: insertInquiry.priority ?? "normal",
      source: insertInquiry.source ?? "email",
      sender: insertInquiry.sender ?? null,
      aiClassification: insertInquiry.aiClassification ?? null,
      subject: insertInquiry.subject ?? null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  // Response operations
  async getResponses(inquiryId: string): Promise<Response[]> {
    return Array.from(this.responses.values()).filter(
      (response) => response.inquiryId === inquiryId
    );
  }

  async getResponsesByUser(userId: string): Promise<Response[]> {
    const userInquiries = await this.getInquiries(userId);
    const inquiryIds = userInquiries.map(i => i.id);
    return Array.from(this.responses.values()).filter(
      (response) => inquiryIds.includes(response.inquiryId)
    );
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = randomUUID();
    const response: Response = { 
      ...insertResponse, 
      id,
      sentAt: new Date(),
      isAutomated: insertResponse.isAutomated ?? true,
      wasModified: insertResponse.wasModified ?? false,
      customerFeedback: insertResponse.customerFeedback ?? null,
      success: insertResponse.success ?? null,
      templateId: insertResponse.templateId ?? null
    };
    this.responses.set(id, response);
    return response;
  }

  async updateResponse(id: string, updates: Partial<Response>): Promise<Response | undefined> {
    const response = this.responses.get(id);
    if (!response) return undefined;
    
    const updatedResponse = { ...response, ...updates };
    this.responses.set(id, updatedResponse);
    return updatedResponse;
  }

  // Integration operations
  async getIntegrations(userId: string): Promise<Integration[]> {
    return Array.from(this.integrations.values()).filter(
      (integration) => integration.userId === userId
    );
  }

  async getIntegration(id: string): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = randomUUID();
    const integration: Integration = { 
      ...insertIntegration, 
      id,
      createdAt: new Date(),
      isActive: insertIntegration.isActive ?? false,
      credentials: insertIntegration.credentials ?? null,
      settings: insertIntegration.settings ?? {},
      lastSync: null
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updatedIntegration = { ...integration, ...updates };
    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  // Analytics operations
  async getAnalytics(userId: string, days?: number): Promise<Analytics[]> {
    const userAnalytics = Array.from(this.analytics.values()).filter(
      (analytics) => analytics.userId === userId
    );
    
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return userAnalytics.filter(
        (analytics) => analytics.date && analytics.date >= cutoffDate
      );
    }
    
    return userAnalytics;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { 
      ...insertAnalytics, 
      id,
      date: new Date(),
      totalInquiries: insertAnalytics.totalInquiries ?? 0,
      automatedResponses: insertAnalytics.automatedResponses ?? 0,
      manualResponses: insertAnalytics.manualResponses ?? 0,
      averageResponseTime: insertAnalytics.averageResponseTime ?? 0,
      customerSatisfaction: insertAnalytics.customerSatisfaction ?? 0,
      timeSaved: insertAnalytics.timeSaved ?? 0
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async updateAnalytics(id: string, updates: Partial<Analytics>): Promise<Analytics | undefined> {
    const analytics = this.analytics.get(id);
    if (!analytics) return undefined;
    
    const updatedAnalytics = { ...analytics, ...updates };
    this.analytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }
}

export const storage = new MemStorage();
