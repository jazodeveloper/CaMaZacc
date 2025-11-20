# CaMaZac - Real Estate Platform

## Overview

CaMaZac is a full-stack real estate platform specializing in property sales. The application enables users to browse properties, register accounts, and send inquiries to administrators. Administrators have access to a dedicated dashboard for managing properties (CRUD operations) and viewing user messages. The platform features a modern, professional design with a yellow-and-dark-gray color scheme, optimized for all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript as the UI framework
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching
- Tailwind CSS for styling with custom design tokens
- Shadcn UI component library for pre-built, accessible components

**Design System:**
- Custom brand-driven design following established color palette (primary yellow #FFD700, secondary #F2C200, dark grays)
- Typography: Poppins (primary) and Montserrat (alternative) from Google Fonts
- Component library based on Radix UI primitives wrapped with custom styling
- Responsive card-based layouts with hover effects and smooth transitions
- Fixed navigation bar with backdrop blur effect
- Spacing follows Tailwind's standardized scale

**State Management:**
- Server state managed through TanStack Query with configured query client
- Session-based authentication state synchronized via `/api/auth/me` endpoint
- Optimistic updates and cache invalidation for property and message mutations
- Custom fetch wrapper (`apiRequest`) handling JSON requests with credential inclusion

**Routing Structure:**
- `/` - Home page with featured properties
- `/propiedades` - Full property catalog with search and filters
- `/propiedad/:id` - Individual property details with image gallery and messaging
- `/login` - User authentication
- `/register` - New user registration
- `/contacto` - General contact form
- `/admin` - Administrator dashboard (protected route)

### Backend Architecture

**Technology Stack:**
- Node.js with Express as the web server framework
- TypeScript for type safety across the stack
- Drizzle ORM for database interactions
- Express Session for authentication state management
- Bcrypt for password hashing
- Multer for file upload handling

**API Design:**
- RESTful API endpoints under `/api` prefix
- Session-based authentication with HTTP-only cookies
- Middleware-based authentication protection (`requireAuth` function)
- Request logging middleware tracking API calls with timing and response data

**Authentication Flow:**
- Password hashing using bcrypt (10 salt rounds)
- Session storage with configurable session middleware
- User roles distinguished by `isAdmin` boolean flag
- Protected routes verify session userId before granting access

**File Upload System:**
- Multer disk storage configured for uploads directory
- File size limit: 5MB per image
- Allowed formats: JPEG, JPG, PNG, WebP
- Unique filename generation using timestamp and random suffix
- Up to 5 images per property supported

**Data Layer:**
- Database abstraction through `IStorage` interface pattern
- `DatabaseStorage` class implementing all CRUD operations
- Drizzle ORM queries with type-safe schema definitions
- Support for cascading deletes on user and property references

### Database Schema

**Technology:**
- PostgreSQL via Neon Database (serverless PostgreSQL)
- Connection pooling through `@neondatabase/serverless`
- Drizzle ORM with `drizzle-kit` for migrations

**Schema Design:**

**Users Table:**
- Primary key: UUID (auto-generated)
- Fields: username (unique), password (hashed), email (unique), fullName, isAdmin flag
- Timestamp: createdAt
- Validation: Zod schema for insert operations

**Properties Table:**
- Primary key: UUID (auto-generated)
- Fields: title, description, address, price (integer), type, images (text array)
- Timestamps: createdAt, updatedAt
- Images stored as array of file paths

**Messages Table:**
- Primary key: UUID (auto-generated)
- Foreign keys: userId (CASCADE delete), propertyId (CASCADE delete)
- Fields: message content, userName (denormalized), userEmail (denormalized)
- Timestamp: createdAt
- Ensures message retention tied to user and property existence

**Seeding:**
- Default admin account creation via seed script
- Credentials: username "admin", password "admin123"
- Admin privileges enabled by default

### Build and Deployment

**Development:**
- Vite dev server with HMR (Hot Module Replacement)
- Express middleware mode integration
- Custom error overlay plugin for runtime errors
- Replit-specific development banners and cartographer integration

**Production Build:**
- Frontend: Vite build output to `dist/public`
- Backend: esbuild bundling to `dist/index.js` with ESM format
- Static file serving from built frontend
- Environment-based configuration via `.env` file

**Configuration:**
- TypeScript with strict mode enabled
- Path aliases: `@/*` for client, `@shared/*` for shared types
- Module resolution: bundler mode for modern bundling
- PostCSS with Tailwind and Autoprefixer

## External Dependencies

**Database:**
- Neon Database (serverless PostgreSQL) via `DATABASE_URL` environment variable
- Connection managed through `@neondatabase/serverless` with WebSocket support (using `ws` package)

**UI Component Library:**
- Radix UI primitives for accessible, unstyled components
- Custom theming through CSS variables and Tailwind integration
- Components include: Dialog, Dropdown, Popover, Toast, Tabs, Select, and more

**Form Management:**
- React Hook Form with Zod resolvers for validation
- Schema validation aligned with Drizzle schema definitions

**File Storage:**
- Local filesystem storage in `/uploads` directory
- Multer middleware for multipart form data handling

**Session Management:**
- Express-session with configurable store
- `connect-pg-simple` available for PostgreSQL session storage (optional)

**Styling:**
- Tailwind CSS with custom configuration
- Google Fonts: Poppins and Montserrat
- CSS custom properties for theme variables
- Class Variance Authority (CVA) for component variants

**Utilities:**
- `date-fns` for date formatting
- `clsx` and `tailwind-merge` for className composition
- `nanoid` for unique ID generation
- `lucide-react` for icon components
- `react-icons` for social media icons

**Development Tools:**
- `tsx` for TypeScript execution in development
- `esbuild` for production backend bundling
- `drizzle-kit` for database migrations and schema management
- Vite plugins for Replit integration and development experience