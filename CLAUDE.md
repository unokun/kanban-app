# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Database Management

- `docker-compose up -d` - Start PostgreSQL database container
- `npx prisma generate` - Generate Prisma client (outputs to app/generated/prisma)
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open Prisma Studio for database inspection

## Architecture Overview

This is a Next.js 15 kanban board application with the following key architectural components:

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **Database**: PostgreSQL with Prisma ORM
- **Drag & Drop**: @dnd-kit/sortable for kanban functionality
- **Icons**: Lucide React

### Database Schema
The application uses a hierarchical data model:
- **Board** → **Column** → **Task**
- Boards contain multiple columns with position-based ordering
- Columns contain multiple tasks with position-based ordering and priority levels
- Tasks support due dates, completion status, and priority (LOW, MEDIUM, HIGH, URGENT)

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `app/generated/prisma/` - Prisma client output directory
- `lib/` - Utility functions and shared logic
- `prisma/` - Database schema and migrations
- `components.json` - shadcn/ui configuration with "new-york" style

### Development Notes
- Prisma client is generated to `app/generated/prisma` (custom output path)
- Database uses PostgreSQL via Docker Compose
- Uses TypeScript path aliases configured in components.json
- Tailwind CSS uses CSS variables and neutral base color

## Development Workflow

### Setting Up New Features
1. Start database: `docker-compose up -d`
2. Generate Prisma client: `npx prisma generate`
3. Start dev server: `npm run dev`

### Server Actions Pattern
- Server Actions are placed in `actions.ts` files within route directories
- Use `"use server"` directive and form data validation with Zod
- Always call `revalidatePath()` after data mutations
- Handle errors gracefully and return structured results

### UI Component Integration
- New shadcn/ui components should be added to `components/ui/`
- Use TypeScript path aliases: `@/components`, `@/lib`, etc.
- Dialog components use Radix UI primitives with custom styling
- Form handling combines Server Actions with client-side state management

### Database Position Management
- Tasks and columns use position-based ordering (integer field)
- When adding new items, query for the highest position and increment by 1
- Unique constraints exist on `(columnId, position)` and `(boardId, position)`

### Priority System
- Tasks have four priority levels: LOW, MEDIUM, HIGH, URGENT
- Priority display uses color-coded badges with Japanese labels
- Default priority is MEDIUM for new tasks