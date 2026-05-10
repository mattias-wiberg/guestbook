<a href="https://guestbook.mattiaswiberg.com/">
  <img alt="Next.js and Supabase Boilerplate - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Boilerplate</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Proxy
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Boilerplate

This is a boilerplate and should be used as an example and baseline for new projects following best practices.

## Setting up a new project

To set up a new project with this boilerpalte there are multiple things that requires changes.

Enviorment variables as a `.env.local` for example for development towards a local database. See the `.env.exmaple` for what variables that are required.

Change of hardcoded values:
In the scripts point the `generate:db` scripts to a schema with the project name (currently poinint towards the `guestbook` schema in this boilerplate).

A helper cli for this will be developed in the future to help not having to do this.

## Clone and run locally

1. Rename `.env.example` to `.env.local` and update with values.

2. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

3. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Database workflow

### Atlas

We use [Atlas](https://atlasgo.io/getting-started) for schema migrations. It gives us proper diff-based migration generation from `supabase/schema.sql`, which makes reviewing changes to triggers, functions, and RLS policies much clearer than hand-written SQL.

Atlas uses a separate `atlas_dev` database as a clean scratch space to compute diffs — this keeps it from conflicting with your running local Supabase database.

#### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) installed
- [Atlas CLI](https://atlasgo.io/getting-started) installed

#### Day-to-day workflow

1. Start the local Supabase stack:

   ```bash
   supabase start
   ```

2. Edit `supabase/schema.sql` with your desired changes.

3. Generate a migration:

   ```bash
   npm run atlas:diff -- <migration_name>
   ```

   This automatically recreates the `atlas_dev` scratch database, diffs your schema against the existing migrations, and writes a new file to `supabase/migrations/`.

4. Review the generated SQL file in `supabase/migrations/`.

5. Apply the migration to your local database:

   ```bash
   supabase db reset
   ```

6. Regenerate TypeScript types:

   ```bash
   npm run generate:db:types
   ```

#### How the dev database works

Atlas requires a clean database to replay migrations into and compute diffs. Because the main local Supabase database (`postgres`) already has your schema applied, we use a separate `atlas_dev` database created from `template0` (bare Postgres). It is seeded with minimal `auth` stubs so that references to `auth.uid()` and `auth.users` in `schema.sql` resolve correctly.

The `npm run atlas:setup` script (called automatically by `atlas:diff`) handles this setup on every run, so you never need to manage `atlas_dev` manually.

## Scripts

This boilerplate comes with several scripts to help with the developer experience

### `generate:db:types`

Generates the required types for the client and server side supabase clients for a type safe approach when interacting with the database. Allow the use of the supabase client as a ORM.

### `generate:db:remote:types`

Same as the `generate:db:types` script but running towards a remote environment given the .
