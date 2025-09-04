import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface InquiryClassification {
  category: string;
  priority: "low" | "normal" | "high" | "urgent";
  intent: string;
  confidence: number;
  requiredVariables: string[];
  suggestedTemplateId?: string;
}

export interface ResponseGeneration {
  content: string;
  confidence: number;
  variables: Record<string, string>;
}

export async function classifyInquiry(
  subject: string,
  content: string,
  existingTemplates: Array<{ id: string; name: string; category: string; content: string }>
): Promise<InquiryClassification> {
  try {
    const templateContext = existingTemplates.map(t => 
      `ID: ${t.id}, Name: ${t.name}, Category: ${t.category}`
    ).join('\n');

    const prompt = `Analyze this customer inquiry and classify it. Return a JSON response with the following structure:
{
  "category": "project|pricing|availability|support|general",
  "priority": "low|normal|high|urgent",
  "intent": "brief description of what the customer wants",
  "confidence": 0.0-1.0,
  "requiredVariables": ["list", "of", "variables", "needed"],
  "suggestedTemplateId": "best matching template ID or null"
}

Available templates:
${templateContext}

Customer inquiry:
Subject: ${subject || "No subject"}
Content: ${content}

Consider urgency indicators like "urgent", "ASAP", deadline mentions, etc. for priority.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing customer inquiries for freelance businesses. Classify inquiries accurately to help automate responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      category: result.category || "general",
      priority: result.priority || "normal",
      intent: result.intent || "General inquiry",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      requiredVariables: result.requiredVariables || [],
      suggestedTemplateId: result.suggestedTemplateId || undefined
    };
  } catch (error) {
    console.error("Failed to classify inquiry:", error);
    return {
      category: "general",
      priority: "normal",
      intent: "Unable to classify inquiry",
      confidence: 0,
      requiredVariables: [],
    };
  }
}

export async function generateResponse(
  inquiryContent: string,
  templateContent: string,
  variables: Record<string, string> = {}
): Promise<ResponseGeneration> {
  try {
    const prompt = `Generate a personalized response to this customer inquiry using the provided template as a base.

Template: ${templateContent}

Customer inquiry: ${inquiryContent}

Available variables: ${JSON.stringify(variables)}

Instructions:
1. Personalize the template based on the specific inquiry
2. Fill in any variables with appropriate values from the inquiry context
3. Maintain a professional but friendly tone
4. Keep the response concise but comprehensive
5. Return JSON with: {"content": "the response", "confidence": 0.0-1.0, "variables": {"extracted": "values"}}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert freelancer assistant helping to craft professional responses to client inquiries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      content: result.content || templateContent,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      variables: result.variables || {}
    };
  } catch (error) {
    console.error("Failed to generate response:", error);
    return {
      content: templateContent,
      confidence: 0,
      variables: {}
    };
  }
}

export async function analyzeSentiment(text: string): Promise<{
  rating: number;
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }"
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating || 3))),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("Failed to analyze sentiment:", error);
    return {
      rating: 3,
      confidence: 0
    };
  }
}

export async function improveTemplate(
  templateContent: string,
  feedbackData: Array<{ success: boolean; customerFeedback?: number; responseTime?: number }>
): Promise<{
  improvedContent: string;
  improvements: string[];
  confidence: number;
}> {
  try {
    const feedbackSummary = {
      successRate: feedbackData.filter(f => f.success).length / feedbackData.length,
      averageRating: feedbackData
        .filter(f => f.customerFeedback)
        .reduce((sum, f) => sum + (f.customerFeedback || 0), 0) / 
        feedbackData.filter(f => f.customerFeedback).length || 0,
      totalUsage: feedbackData.length
    };

    const prompt = `Improve this email template based on performance data.

Current template: ${templateContent}

Performance data:
- Success rate: ${(feedbackSummary.successRate * 100).toFixed(1)}%
- Average customer rating: ${feedbackSummary.averageRating.toFixed(1)}/5
- Total usage: ${feedbackSummary.totalUsage} times

Please suggest improvements and return JSON with:
{
  "improvedContent": "the improved template",
  "improvements": ["list of specific improvements made"],
  "confidence": 0.0-1.0
}

Focus on clarity, professionalism, and addressing common customer concerns.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in freelance business communications. Improve templates based on performance data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      improvedContent: result.improvedContent || templateContent,
      improvements: result.improvements || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("Failed to improve template:", error);
    return {
      improvedContent: templateContent,
      improvements: [],
      confidence: 0
    };
  }
}
