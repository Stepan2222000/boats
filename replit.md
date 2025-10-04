# Boat Marketplace - Replit Configuration

### Overview
This project is a boat marketplace application built with React, Express, and PostgreSQL, targeting Russian-speaking users. It allows browsing, searching, and listing boats for sale, enhanced with AI-powered listing generation. The platform draws design inspiration from successful marketplaces like Avito and Airbnb, aiming to provide a robust and intuitive user experience for boat enthusiasts and sellers.

### User Preferences
Preferred communication style: Simple, everyday language.

### System Architecture

#### Frontend Architecture
The frontend uses React 18 with TypeScript, Vite for bundling, and Wouter for routing. UI components are built with Shadcn/ui (New York variant) and Radix UI primitives, styled using Tailwind CSS with custom design tokens and CSS variables for theming. A mobile-first responsive design is employed, featuring a photography-first visual hierarchy and a custom color palette with a primary blue for CTAs.

#### Backend Architecture
The backend is an Express.js application written in TypeScript, using an ESM module system. It provides RESTful APIs under the `/api` namespace with Zod for runtime validation and Drizzle-Zod for database schema validation. Key features include phone number and password-based authentication with secure bcrypt hashing, session management via PostgreSQL, and protected routes for listing management and administration. An admin panel allows moderation of listings, user management, and AI model configuration.

#### Data Storage
The application uses PostgreSQL via Neon serverless database, accessed with Drizzle ORM for type-safe queries. The schema includes `users` (for authentication, with phone and password hash), `sessions` (for Express session storage), and `boats` (for listing details, including title, description, specifications, pricing, media, location, and view tracking). Migrations are managed in a dedicated directory, and the schema is defined in `shared/schema.ts`. Query patterns support full-text search, range filtering, location-based filtering, and sorting.

### External Dependencies

#### AI Integration
- **OpenAI GPT API**: Utilized for intelligent listing generation, processing raw user input into structured listings, extracting boat specifications, and generating professional Russian-language descriptions and titles. Requires `OPENAI_API_KEY`.

#### Database Service
- **Neon serverless PostgreSQL**: Provides the primary data storage. Connection is established using `@neondatabase/serverless` with WebSocket support and managed via the `DATABASE_URL` environment variable. Also used by `connect-pg-simple` for persistent user session storage.

#### Authentication Service
- **Custom Phone Number + Password Authentication**: Replaces Replit Auth. Uses bcrypt for password hashing and PostgreSQL-backed sessions for secure user authentication and session management.

#### Development Tools
- **Replit-specific Vite Plugins**: Includes `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner`, which are active during development when `REPL_ID` is present.