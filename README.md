# WikiMudas (codename Ilicura)

[wikimudas.oama.eco.br](https://wikimudas.oama.eco.br)

Wikimudas is a webapp ~~(PWA-enabled)~~ designed as a way of sharing and easily accessing information on how to age and sex birds in the hand (for bird banders). Right now the data available is from only one source, but the plan is to make it a wiki-like program and receive contributions from different research institutions.

## Development

WikiMudas was build in a 2\*2 month sprint and has some technical debt as well as some UI issues. This is a volunteer contribution from Pedro Martins to the Mantiqueira Bird Observatory - owner of the codebase.

Offline usage is important for the target audience (field biologists, usually in remote areas). The first experiment was done with a PWA that did not work well - cloud-stored images were hard to add to the cache. Next experiment will be with React Native and image packs.

### How this was built (technical overview)

- **Core stack**
  - **Next.js 14 (App Router) + React 18 + TypeScript**: routes live in `src/app`; global layout in `src/app/layout.tsx`.
  - **tRPC v10 + TanStack Query**: typed end-to-end API. Client hooks via `@/trpc/react`; server routers in `src/server/api/routers/*`, context in `src/server/api/context.ts`, root router in `src/server/api/root.ts`.
  - **PostgreSQL + Drizzle ORM**: schema in `src/server/db/schema.ts`; migrations under `drizzle/` with snapshots in `drizzle/meta/`. Migration helpers in `scripts/migrate.ts` and `scripts/migrate-one.ts`.
  - **Auth (Supabase)**: handled with `@supabase/ssr` and `@supabase/auth-helpers-nextjs` (`src/utils/supabase/*`). Route protection via `middleware.ts`.
  - **UI**: Tailwind CSS + Radix UI primitives with `class-variance-authority`, `tailwind-merge`, and `tailwindcss-animate`. Components live in `src/components/*`.
  - **Images**: ImageKit for upload/delivery. Next Image allows `ik.imagekit.io` (see `next.config.js`). Signing endpoint at `src/app/api/imagekit-auth`.

- **Project structure**
  - `src/app`: route segments, layouts, API routes (`src/app/api/*`), admin pages.
  - `src/server`: tRPC server (`api/`), DB access (`db/`).
  - `src/components`: shared UI and admin-mode components.
  - `drizzle/`: SQL migrations and metadata snapshots.
  - `public/`: static assets, PWA files (manifest, SW).
  - `scripts/`: database migration scripts.
  - `data-management/`: few R scripts to get the species metadata in the correct structure.

- **Data flow**
  - UI calls `tRPC` hooks provided by `TRPCReactProvider` in `src/app/layout.tsx`.
  - Procedures run on the server and interact with PostgreSQL via Drizzle in `src/server/db/*`.
  - Auth state is available server-side (Supabase SSR) and injected into the tRPC context.

- **Build and quality gates**
  - Type-checking and ESLint are configured, but production builds are allowed to proceed even with errors for pragmatism during early sprints:
    - `typescript.ignoreBuildErrors: true`
    - `eslint.ignoreDuringBuilds: true`

- **Local development**
  - Install and run:
    ```bash
    npm install
    # set required environment variables (Postgres, Supabase, ImageKit)
    npm run db:push        # or: npm run db:migrate
    npm run dev
    ```
  - Helpful scripts:
    ```bash
    npm run db:studio      # Drizzle Studio
    npm run db:migrate-one # create/apply a single migration
    ```

- **Environment and images**
  - Runtime env validation via `src/env.js`.
  - Next Image `remotePatterns` restricts hosts to ImageKit (see `next.config.js`).

- **Notable design choices**
  - App Router + tRPC for fully typed paths from DB to UI.
  - Drizzle with SQL snapshots for transparent, reviewable migrations.
  - PWA with explicit precache lists to support field work with limited connectivity.

## Roadmap

WikiMudas Next Steps:
Improve Admin panel
Plan data entry
Create an app with offline capabilities

To-do list:

1- Improve Admin Mode UI
2- Add auth for admin mode
3- Improve images in offline mode
4- Implement approval system
4.1 - Database
4.2 - UI
4.3 - Queries/Endpoints
5- Create extra pages with basic information about the app, ageing and molting birds
