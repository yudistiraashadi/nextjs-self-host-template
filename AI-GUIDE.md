# AI Code Assistant Guide

This document provides context for AI assistants (like Cursor) to understand the structure and patterns used in this Next.js project.

## Project Overview

This is a Next.js project template configured with a specific structure and set of technologies aimed at type-safety and developer efficiency. It uses the App Router.

## Key Technologies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Components:** Shadcn UI, supplemented by custom components in `src/components` (global) and `src/features/**/components` (feature-specific).
- **Styling:** Tailwind CSS (`tailwind.config.ts`, `postcss.config.mjs`)
- **Database ORM:** Drizzle ORM (`src/db/drizzle/schema.ts`, `src/db/drizzle/connection.ts`, `drizzle/` for migrations) - Chosen for type-safety and SQL-like syntax.
- **Data Fetching (Client):** Tanstack Query (`@tanstack/react-query`) for caching and state management of server data.
- **Server API:** Custom type-safe API endpoints defined using `createServerApi` utility in `src/server-api`.
- **Server Actions:** Standard Next.js Server Actions, often used with Zod for validation.
- **Validation:** Zod, often with `zod-form-data` for form handling in Server Actions.
- **Environment Variables:** `@t3-oss/env-nextjs` for type-safe environment variables (`src/env.ts`, `.env`).
- **Authentication:** Better Auth
- **File Storage:** S3-compatible storage with utilities in `src/lib/utils/s3-storage.ts`
- **Linting/Formatting:** ESLint (`eslint.config.mjs`), Prettier.
- **Package Manager:** pnpm (`pnpm-lock.yaml`)

## Project Structure Highlights

- **`src/`**: Main application code.
  - **`app/`**: Next.js App Router. Contains layouts, pages, route handlers. The root layout is configured for Tanstack Query and Shadcn UI.
  - **`components/`**: Global, reusable UI components (prefer Shadcn UI or feature-specific components first).
  - **`db/drizzle/`**: Drizzle ORM setup.
    - `schema.ts`: Defines database tables. **Crucial file for data models.**
    - `connection.ts`: Database connection logic.
  - **`features/`**: Code organized by feature (colocation). Each feature directory might contain `actions/`, `components/`, `utils/`, etc. This is the preferred way to organize business logic.
  - **`lib/`**: Global utility functions, hooks, helpers.
    - **`utils/s3-storage.ts`**: **IMPORTANT:** S3-compatible file storage utilities for handling file uploads, downloads, and URL generation. Always use these helpers for any S3 operations.
  - **`server-api/`**: Defines type-safe server API endpoints using `createServerApi`.
    - `load-server-api.ts`: **IMPORTANT:** New server APIs created within features **must** be imported here to be registered.
  - `middleware.ts`: Next.js middleware.
- **`drizzle/`**: Drizzle ORM migration files and configuration.
- **Configuration Files (Root):**
  - `next.config.ts`
  - `tsconfig.json`
  - `tailwind.config.ts`
  - `postcss.config.mjs`
  - `eslint.config.mjs`
  - `package.json`
  - `.env` / `.env.example` (Environment variables)

## Common Patterns

1.  **Server Actions for Mutations:**
    - Defined within features (`src/features/**/actions/`).
    - Use `"use server";` directive.
    - Employ `zod` and `zod-form-data` for input validation (see `README.md` for example).
2.  **Server API + Tanstack Query for Data Fetching:**
    - Define API endpoint logic (e.g., `getPostListFunction`) usually within a feature's `actions` or a dedicated `api` directory.
    - Create a type-safe API definition using `createServerApi` in `src/server-api/` or within the feature itself.
    - **Crucially, import the API definition in `src/server-api/load-server-api.ts`.**
    - Use `useQuery` from Tanstack Query on the client-side (in components) to call the API function. Query keys often reflect the data being fetched (e.g., `["posts"]`).
3.  **Database Schema:**
    - Define tables in `src/db/drizzle/schema.ts` using Drizzle's syntax.
    - Generate migrations using `pnpm db:generate`.
    - Apply migrations using `pnpm db:push`.
4.  **Environment Variables:**
    - Defined in `.env`.
    - Validated and accessed via the `env` object imported from `src/env.ts`.
5.  **Feature-Based Colocation:**
    - Keep code related to a specific feature (UI, server actions, utils) together within a directory under `src/features/`.
6.  **S3 File Storage:**
    - Use the utilities in `src/lib/utils/s3-storage.ts` for all file operations.
    - Functions include `getFileUrl()` for retrieving URLs (public or signed), `downloadFile()` for getting file contents, and more.
    - The storage utilities handle both public and private files with appropriate authentication.

## Development Workflow

1.  **Setup:** Ensure Docker environment is running (`docker-compose -f docker-compose.development.yml up -d`), install dependencies (`pnpm install`), copy `.env.example` to `.env` and fill values, run initial migrations (`pnpm db:push`).
2.  **Run Dev Server:** `pnpm dev`.
3.  **Database Changes:** Modify `src/db/drizzle/schema.ts`, run `pnpm db:generate`, then `pnpm db:push`. Use `pnpm db:studio` to view data.
4.  **Adding Server APIs:** Define the function, create the API using `createServerApi`, and **import it in `src/server-api/load-server-api.ts`**.
5.  **File Storage:** Use the S3 utilities in `src/lib/utils/s3-storage.ts` rather than implementing your own S3 client operations.
6.  **Linting/Formatting:** Use `pnpm lint` and `pnpm format:write`.

This guide should help navigate the codebase and understand its core concepts. Refer to the `README.md` for more detailed examples and setup instructions.
