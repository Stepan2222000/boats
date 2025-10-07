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

**Real-time Admin Dashboard**: WebSocket server (`/ws` path) provides live updates to admin clients when boat listings change status. Features include:
- Automatic reconnection with exponential backoff (up to 10 attempts)
- Server-side heartbeat (ping/pong every 30 seconds)
- Singleton WebSocket server to prevent memory leaks during HMR
- Broadcasts on AI processing completion, edits, approvals, and rejections

#### Data Storage
The application uses PostgreSQL via Neon serverless database, accessed with Drizzle ORM for type-safe queries. The schema includes:
- **users**: Authentication with phone and password hash
- **sessions**: Express session storage
- **boats**: Listing details including title, description, specifications, pricing, media, location, and view tracking. New fields for admin moderation workflow:
  - `status`: "ai_processing" | "ai_ready" | "approved" | "rejected"
  - `rawDescription`: User's original prompt for AI processing
  - `aiError`: Stores AI processing errors for admin review
  - `rejectionReason`: Admin's reason for rejecting a listing
- **boatContacts**: Contact information (phone, email, telegram) for boat listings

Migrations are managed in a dedicated directory, and the schema is defined in `shared/schema.ts`. Query patterns support full-text search, range filtering, location-based filtering, and sorting.

### Admin Moderation Workflow

The platform implements a complete admin moderation system with real-time updates:

1. **User Submits Listing**: User provides raw description, boat details, photos, and contacts
2. **Immediate Creation**: Listing created instantly with status "ai_processing"
3. **AI Processing**: Background job processes listing with OpenAI (async, non-blocking)
   - On success: Updates listing, sets status to "ai_ready"
   - On error: Sets status to "ai_ready", stores error in `aiError` field
4. **Real-time Update**: WebSocket broadcasts status change to all connected admins
5. **Admin Review**: Admin sees:
   - User's original prompt (`rawDescription`)
   - AI-generated content (title, description, specs)
   - Contact information
   - Photos
   - Any AI processing errors
6. **Admin Actions**:
   - **Edit**: Modify any listing field, changes broadcast to other admins
   - **Approve**: Status → "approved", listing appears on public site
   - **Reject**: Status → "rejected" with optional reason, listing hidden from public

Admin credentials: phone "root", password "root" (for testing only)

### External Dependencies

#### AI Integration
- **OpenAI GPT API**: Utilized for intelligent listing generation, processing raw user input into structured listings, extracting boat specifications, and generating professional Russian-language descriptions and titles. Requires `OPENAI_API_KEY`.

#### Database Service
- **Neon serverless PostgreSQL**: Provides the primary data storage. Connection is established using `@neondatabase/serverless` with WebSocket support and managed via the `DATABASE_URL` environment variable. Also used by `connect-pg-simple` for persistent user session storage.

#### Authentication Service
- **Custom Phone Number + Password Authentication**: Replaces Replit Auth. Uses bcrypt for password hashing and PostgreSQL-backed sessions for secure user authentication and session management.

#### Development Tools
- **Replit-specific Vite Plugins**: Includes `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner`, which are active during development when `REPL_ID` is present.