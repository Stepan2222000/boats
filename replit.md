# Boat Marketplace - Replit Configuration

## Overview

This is a boat marketplace application built with React, Express, and PostgreSQL. The platform allows users to browse, search, and list boats for sale, with AI-powered listing generation using OpenAI. The application targets Russian-speaking users and takes design inspiration from successful marketplaces like Avito and Airbnb.

## Recent Changes

**October 4, 2025** - Contact Fields Implementation
- **Contact Type & Phone**: Added contactType (enum: phone/whatsapp/telegram) and contactPhone fields to boats schema
  - Database migration: ALTER TABLE boats ADD contact_type varchar, contact_phone text
  - Russian phone validation: /^\+7\d{10}$/ (e.g., +79991234567)
  - Default contactPhone in CreateListingPage auto-fills with user.phone
- **Form Integration**: Both CreateListingPage and EditListingPage include Select for contact type and Input for contact phone
  - Select options: "Телефон", "WhatsApp", "Telegram" with respective icons
  - Phone/MessageCircle/Send icons from lucide-react
- **API Endpoint Fix**: Updated /api/boats/ai-create to include contactType and contactPhone in aiInputSchema and boatData
  - Bug fixed: AI-created listings now properly save contact information
- **Display Logic**: ListingPage shows contact button with appropriate icon based on contactType
  - Phone → Phone icon, WhatsApp → MessageCircle icon, Telegram → Send icon
  - Backward compatibility: Falls back to old phone field if contactPhone not present
- **Type Safety**: All contact fields properly typed, no 'any' types used
- **Testing**: E2E test confirms: registration → create listing with WhatsApp contact → display with correct icon and phone number

**October 4, 2025** - Photo Upload Fix & CreateListingPage Improvements
- **Photo Upload Fixed (CRITICAL)**: 
  - Fixed "Не удалось обработать загруженные фото" error after successful uploads
  - Changed mapping strategy from uploadURL → normalizedPath to file.id → normalizedPath
  - Uppy's `result.successful` doesn't reliably contain uploadURL, but always has file.id
  - handleGetUploadParameters now stores: `fileIdToNormalizedPathRef[file.id] = normalizedPath`
  - handleUploadComplete uses file.id to retrieve normalizedPath and fetch presigned URLs
  - End-to-end tested and confirmed working - photos upload and display correctly
- **Light Theme Applied**: Redesigned CreateListingPage with light colors (white background, blue accents) matching rest of site
- **Form Improvements**:
  - Removed default values for price (0) and year (2025) - now empty by default
  - Updated description placeholder to avoid duplicating model/year info
  - Clean white input fields with blue borders and proper contrast
- **UI Consistency**: All pages (except login/register) now use light theme with white/blue color scheme

**October 4, 2025** - Phone Number Authentication System with Production-Grade Security
- **Custom Authentication**: Replaced Replit Auth with phone number + password authentication using bcrypt for secure password hashing
- **Database Schema**: Updated users table (id, phone unique, passwordHash, createdAt, updatedAt) - removed email, firstName, lastName fields
- **Session Management**: PostgreSQL-backed sessions with userId stored in session data
- **Security Architecture**:
  - Created PublicUser type (Omit<User, 'passwordHash'>) to prevent password hash leakage
  - Storage layer returns only PublicUser for all public-facing methods
  - TypeScript compile-time protection against accidental password exposure
  - Frontend strongly typed with PublicUser[] - no 'any' types
- **Modern AI-Style UI**: Completely redesigned registration and login pages with dark gradient backgrounds (slate-950/blue-950/indigo-950), glowing effects, grid patterns, and floating particle animations
- **Auth Routes**:
  - POST /api/register - Create new user, returns PublicUser (409 for duplicates, 400 for validation)
  - POST /api/login - Authenticate user, returns PublicUser (401 with safe error message)
  - POST /api/logout - Destroy session
  - GET /api/auth/user - Get current user state (PublicUser)
  - GET /api/admin/users - Admin endpoint returns PublicUser[] (no password hashes)
- **Error Handling**: Normalized HTTP status codes and user-friendly messages without implementation details
- **Header Updates**: Login/Register buttons when not authenticated, user avatar dropdown with phone number when authenticated
- **Admin Panel**: New "Пользователи" tab showing all registered users with phone numbers, IDs, and registration dates (strongly typed, secure)
- **Protected Routes**: CreateListingPage requires authentication, listings linked to user phone accounts

**October 3, 2025** - Photo Upload Enhancements
- **Uppy Modal Styling**: Custom maritime-themed CSS with blue gradients, smooth animations, styled progress bars, and rounded corners for professional appearance
- **Sequential Upload**: Files now upload one at a time (limit: 1) for reliability and better user feedback
- **Preview Display**: Photo previews now load correctly using presigned download URLs instead of direct paths
- **Enhanced Preview UI**: Added loading spinners, numbered badges (1, 2, 3...), styled delete buttons with hover effects, and border styling
- **API Endpoints**: Created POST /api/objects/download-url for fetching presigned URLs for photo previews
- **Path Normalization**: Implemented uploadURL → normalizedPath mapping to ensure correct object paths for preview requests
- **Parallel Loading**: Presigned URLs fetch in parallel for better performance

**October 3, 2025** - UI/UX Improvements & Admin Panel
- Fixed header search: Added form submission handlers for desktop/mobile, routes to /search?q=query on Enter
- Redesigned search results: Compact, minimalistic layout with smaller paddings, reduced typography, and controls for immediate visibility of listings
- Enhanced AI prompts: Updated interpretSearchQuery to extract detailed features (size, cabin, etc.) not just basic parameters
- Added admin panel: New /admin route with tabbed interface for managing AI model selection and custom prompts (includes database schema aiSettings table and API endpoints)
- Redesigned boat cards: **Horizontal layout** with image on left (fixed width 192-256px), content on right. Prominent price, blue title, compact metadata. Search results display cards in vertical stack for maximum photo visibility
- Added admin access button: Small semi-transparent Settings icon button in footer with prompt-based authentication (login: root, password: root)

**October 3, 2025** - Listing Management & View Tracking
- **View Tracking System**: Implemented automatic view counting for boat listings
  - Database fields: viewCount (integer) and viewHistory (jsonb array with userId + timestamp)
  - POST /api/boats/:id/view endpoint records each view (anonymous or authenticated)
  - ListingPage automatically registers views on mount
  - View statistics displayed to listing owners on ListingPage
- **Edit Functionality**: Full listing editing capabilities for owners
  - New EditListingPage at /edit/:id route with pre-filled form
  - PUT /api/boats/:id endpoint with owner verification
  - Only listing owners can see "Изменить" button on ListingPage
  - Redirects non-owners attempting to access edit page
  - Cache invalidation for both collection and individual listing
- **Delete Functionality**: Owners can delete their listings
  - DELETE /api/boats/:id endpoint with owner verification
  - Delete button visible only to listing owners
  - Proper cache cleanup after deletion
- **Admin Listings Management**: New "Объявления" tab in admin panel
  - View all listings with statistics (total listings, views, average price)
  - Each listing shows: title, description, price, year, location, type, view count, promoted status
  - Quick access buttons: "Просмотр" to view listing, "Изменить" to edit (admin can edit any listing)
  - Horizontal card layout with badges for metadata
- **Security**: All edit/delete operations verify user ownership before allowing modifications

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
- Authentication routes:
  - `GET /api/auth/user` - Get current authenticated user
  - `GET /api/login` - Initiate Replit Auth login flow
  - `GET /api/logout` - Logout and clear session
  - `GET /api/callback` - OIDC callback handler
- Boat listing routes:
  - `GET /api/boats` - Retrieve all boats
  - `GET /api/boats/search` - Search with filters (query, price, year, type, location)
  - `GET /api/boats/:id` - Get single boat details
  - `POST /api/boats/ai-create` - AI-powered listing creation (requires authentication)
  - `POST /api/boats` - Create boat listing (requires authentication)
  - `PUT /api/boats/:id` - Update boat listing (requires authentication + ownership)
  - `DELETE /api/boats/:id` - Delete boat listing (requires authentication + ownership)
  - `POST /api/boats/:id/view` - Record view (anonymous or authenticated)
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
- `users` table for user authentication:
  - Identity: id (varchar UUID primary key)
  - Profile: email, firstName, lastName, profileImageUrl
  - Timestamps: createdAt, updatedAt
- `sessions` table for Express session storage:
  - Used by connect-pg-simple for session persistence
  - Fields: sid (primary key), sess (jsonb), expire (timestamp)
- `boats` table as primary entity with fields:
  - Identity: id (UUID), timestamps
  - Owner: userId (references users.id)
  - Content: title, description, manufacturer, model
  - Specifications: year, length, boatType
  - Pricing: price, currency (defaults to ₽)
  - Media: photoCount, photoUrls
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
- Session storage via connect-pg-simple for persistent user sessions

**Authentication Service**
- Replit Auth using OpenID Connect (OIDC) protocol
- Passport.js for authentication middleware
- Session management with express-session and PostgreSQL storage
- Environment variables: `SESSION_SECRET`, `ISSUER_URL`, `REPL_ID`
- Automatic user profile creation/update on first login

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