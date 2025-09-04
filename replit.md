# AutoReply Pro

## Overview

AutoReply Pro is an AI-powered customer service automation platform that intelligently classifies incoming customer inquiries and generates appropriate responses using predefined templates. The system features machine learning capabilities that improve over time by analyzing response effectiveness and customer feedback.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for development and build tooling
- **UI Components**: Shadcn/ui component library built on top of Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management with built-in caching and synchronization
- **Forms**: React Hook Form with Zod schema validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **API Design**: RESTful endpoints following conventional HTTP methods and status codes
- **Error Handling**: Centralized error middleware for consistent error responses
- **Development**: Hot module replacement via Vite integration for seamless development experience

### AI Integration
- **Provider**: OpenAI GPT models for natural language processing
- **Classification**: Automated inquiry categorization with confidence scoring
- **Response Generation**: Template-based response creation with variable substitution
- **Learning**: Continuous improvement through feedback analysis and pattern recognition
- **Sentiment Analysis**: Customer emotion detection for priority assignment

### Database Schema Design
- **Users**: Authentication and user management with username/password
- **Templates**: Reusable response templates with category classification and success tracking
- **Inquiries**: Customer messages with AI-generated metadata and priority levels
- **Responses**: Generated replies with automation flags and customer feedback tracking
- **Integrations**: Third-party platform connections with activation status
- **Analytics**: Performance metrics and learning progress data

### Authentication & Security
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **User System**: Simple username/password authentication (MVP implementation)
- **Database Security**: Environment-based connection strings and prepared statements

## External Dependencies

### Database Services
- **PostgreSQL**: Primary data storage via Neon Database serverless platform
- **Session Store**: PostgreSQL-backed session management for user authentication

### AI/ML Services  
- **OpenAI API**: GPT models for text classification, response generation, and sentiment analysis
- **Natural Language Processing**: Automated inquiry understanding and response optimization

### Email Integration Platforms
- **Gmail API**: Email monitoring and automated response sending
- **Third-party Connectors**: Extensible integration system for Slack, Discord, and Telegram

### Development & Deployment
- **Replit Platform**: Integrated development environment with hot reloading and deployment
- **Vite Development Server**: Fast development experience with HMR and TypeScript support
- **Build Tools**: ESBuild for production bundling and optimization

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Consistent icon system throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system variables
- **Date-fns**: Date manipulation and formatting utilities