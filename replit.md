# LangueSage Blog Application

## Overview

LangueSage is a modern blog application focused on philosophical, scientific, and human-interest articles. The application features a full-stack architecture with a React frontend and Express.js backend, using PostgreSQL for data persistence via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Style**: RESTful endpoints under `/api` namespace
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with Vite middleware integration

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver for database connectivity

## Key Components

### Data Model
The application centers around a single `articles` table with the following structure:
- **Articles**: ID, title, content, excerpt, category, tags, author, published status, timestamps
- **Categories**: Three predefined categories (scientific, human, philosophical)
- **Validation**: Zod schemas for runtime type validation

### API Endpoints
- `GET /api/articles` - Retrieve all published articles (admin flag for unpublished)
- `GET /api/articles/:id` - Retrieve single article by ID
- `POST /api/articles` - Create new article
- `PATCH /api/articles/:id` - Update existing article
- `DELETE /api/articles/:id` - Delete article

### Storage Layer
Currently implements an in-memory storage system (`MemStorage`) with seeded sample data. This serves as a development implementation that can be easily replaced with database-backed storage implementing the same `IStorage` interface.

### User Interface
- **Layout**: Sidebar navigation with header and main content area
- **Pages**: Home (article listing), Article Detail, Create Article, Admin dashboard
- **Components**: Reusable article cards, rich text editor, form components
- **Responsive**: Mobile-friendly design with collapsible sidebar

## Data Flow

1. **Article Creation**: User fills form → Validation via Zod → API endpoint → Storage layer
2. **Article Display**: Page load → React Query fetch → API endpoint → Storage layer → UI rendering
3. **Article Management**: Admin interface → CRUD operations → API endpoints → Storage layer
4. **Search/Filter**: Client-side filtering of cached article data

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **UI Components**: Radix UI primitives for accessible components
- **Form Handling**: React Hook Form with Zod resolvers
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with class-variance-authority for component variants

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Database**: Drizzle Kit for schema management and migrations
- **Development**: Hot reload via Vite middleware integration
- **Replit Integration**: Cartographer plugin for Replit-specific features

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Uses Vite dev server with Express middleware
- **Production**: Serves static files from Express with built React app
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Hosting Considerations
- Single-process deployment with Express serving both API and static files
- Database migrations managed through Drizzle Kit
- Environment-specific configuration via NODE_ENV
- Asset serving through Express static middleware in production

The application is architected for easy transition from the current in-memory storage to full database integration, with clear separation of concerns between storage interface and implementation.