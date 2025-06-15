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