# AutoReply Pro

AutoReply Pro is an AI-powered customer service automation tool for modern freelancers and businesses. It uses artificial intelligence to automatically classify and respond to customer inquiries, saving you time and improving customer satisfaction.

## Features

*   **AI-Powered Inquiry Classification:** Automatically categorizes incoming inquiries with high accuracy.
*   **Smart Response Templates:** Create dynamic response templates that adapt to the context of the inquiry.
*   **Continuous Learning:** The AI continuously learns and improves from your interactions and feedback.
*   **Multi-Platform Integration:** Seamlessly integrate with popular communication platforms like Gmail, Slack, and more.
*   **Real-Time Analytics:** Monitor your automation performance and gain insights into your customer interactions.
*   **Customizable Settings:** Fine-tune the AI's behavior to match your brand's voice and tone.

## Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Radix UI, Recharts
*   **Backend:** Node.js, Express, TypeScript
*   **AI:** OpenAI GPT-5
*   **Database:** In-memory storage (for demo purposes)
*   **Build Tool:** Vite

## Getting Started

To get started with AutoReply Pro, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following environment variables:
    ```
    OPENAI_API_KEY=your-openai-api-key
    ```
4.  **Run the application:**
    ```bash
    npm run dev
    ```
    This will start the development server for both the client and the server. The application will be available at `http://localhost:5173`.

## Project Structure

The project is organized into the following directories:

*   `client/`: Contains the frontend React application.
    *   `src/`: The source code for the client application.
        *   `components/`: Reusable UI components.
        *   `hooks/`: Custom React hooks.
        *   `lib/`: Utility functions and libraries.
        *   `pages/`: The pages of the application.
*   `server/`: Contains the backend Node.js application.
    *   `services/`: Services for interacting with external APIs (e.g., OpenAI).
*   `shared/`: Contains code that is shared between the client and the server (e.g., database schema).

## API Endpoints

The following API endpoints are available:

*   `GET /api/templates`: Get all templates.
*   `POST /api/templates`: Create a new template.
*   `PUT /api/templates/:id`: Update a template.
*   `DELETE /api/templates/:id`: Delete a template.
*   `GET /api/inquiries`: Get all inquiries.
*   `POST /api/inquiries`: Create a new inquiry.
*   `GET /api/responses`: Get all responses.
*   `POST /api/responses`: Create a new response.
*   `PUT /api/responses/:id/feedback`: Update a response with feedback.
*   `GET /api/analytics`: Get analytics data.
*   `GET /api/analytics/summary`: Get a summary of analytics data.
*   `GET /api/integrations`: Get all integrations.
*   `POST /api/integrations`: Create a new integration.
*   `PUT /api/integrations/:id`: Update an integration.
*   `POST /api/ai/classify`: Classify an inquiry.
*   `POST /api/ai/generate-response`: Generate a response.
*   `POST /api/ai/improve-template/:id`: Improve a template.
*   `PUT /api/settings/profile`: Update profile settings.
*   `PUT /api/settings/ai`: Update AI settings.
*   `PUT /api/settings/notifications`: Update notification settings.
