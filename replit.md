# Boat Marketplace - Replit Configuration

## Overview

This is a boat marketplace application built with React, Express, and PostgreSQL. The platform allows users to browse, search, and list boats for sale, with AI-powered listing generation using OpenAI. The application targets Russian-speaking users and takes design inspiration from successful marketplaces like Avito and Airbnb.

## Recent Changes

**October 3, 2025** - UI/UX Improvements & Admin Panel
- Fixed header search: Added form submission handlers for desktop/mobile, routes to /search?q=query on Enter
- Redesigned search results: Compact, minimalistic layout with smaller paddings, reduced typography, and controls for immediate visibility of listings
- Enhanced AI prompts: Updated interpretSearchQuery to extract detailed features (size, cabin, etc.) not just basic parameters
- Added admin panel: New /admin route with tabbed interface for managing AI model selection and custom prompts (includes database schema aiSettings table and API endpoints)
- Redesigned boat cards: **Horizontal layout** with image on left (fixed width 192-256px), content on right. Prominent price, blue title, compact metadata. Search results display cards in vertical stack for maximum photo visibility

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for the UI layer
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component Library**
- Shadcn/ui components (New York variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- CSS variables for theming support (light/dark mode ready)
- Inter font family for comprehensive Cyrillic support

**Design System**
- Custom color palette optimized for marketplace trust and visual appeal
- Primary blue (hsl(205 85% 45%)) for CTAs and brand elements
- Semantic colors for status indicators (green/available, orange/warning, red/sold)
- Mobile-first responsive design approach
- Photography-first visual hierarchy for high-value boat listings

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM module system throughout the codebase
- Custom middleware for request logging and error handling
- Development mode with hot-reload support via Vite integration

**API Design**
- RESTful endpoints under `/api` namespace
- Key routes:
  - `GET /api/boats` - Retrieve all boats
  - `GET /api/boats/search` - Search with filters (query, price, year, type, location)
  - `GET /api/boats/:id` - Get single boat details
  - `POST /api/boats/ai-create` - AI-powered listing creation
- JSON request/response format with Zod validation

**Data Validation**
- Zod schemas for runtime type validation
- Integration with React Hook Form via @hookform/resolvers
- Drizzle-Zod for database schema validation
- Custom error formatting with zod-validation-error

### Data Storage

**Database**
- PostgreSQL via Neon serverless database
- Drizzle ORM for type-safe database queries
- WebSocket connection support for serverless environments

**Schema Design**
- `boats` table as primary entity with fields:
  - Identity: id (UUID), timestamps
  - Content: title, description, manufacturer, model
  - Specifications: year, length, boatType
  - Pricing: price, currency (defaults to ₽)
  - Media: photoCount
  - Location: location field
  - Features: isPromoted flag for highlighted listings
- All migrations stored in `/migrations` directory
- Schema defined in `shared/schema.ts` for shared access between client/server

**Query Patterns**
- Full-text search across title, description, manufacturer, and model
- Range filtering for price, year, and boat length
- Location-based filtering
- Sorting by creation date (newest first)

### External Dependencies

**AI Integration**
- OpenAI GPT API for intelligent listing generation
- Processes raw user descriptions into polished, structured listings
- Extracts and normalizes boat specifications (manufacturer, model, type, length)
- Generates professional Russian-language descriptions and titles
- Environment variable: `OPENAI_API_KEY`

**Database Service**
- Neon serverless PostgreSQL database
- Connection via `@neondatabase/serverless` package with WebSocket support (using `ws` library)
- Connection string via `DATABASE_URL` environment variable
- Pooled connections for optimal performance

**Development Tools**
- Replit-specific plugins for enhanced development experience:
  - `@replit/vite-plugin-runtime-error-modal` - Runtime error overlay
  - `@replit/vite-plugin-cartographer` - Code mapping
  - `@replit/vite-plugin-dev-banner` - Development banner
- Only loaded in development mode when `REPL_ID` is present

**Build & Deployment**
- esbuild for server-side bundling in production
- Vite for client-side bundling
- Output structure:
  - Client assets → `dist/public`
  - Server bundle → `dist/index.js`
- Production mode serves static files from dist directory

**Path Aliases**
- `@/*` → `client/src/*` (frontend code)
- `@shared/*` → `shared/*` (shared types/schemas)
- `@assets/*` → `attached_assets/*` (static assets)