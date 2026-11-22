# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

A catalog and pre-order site for Uyghur children's books (150+ books grouped into sets) from Ewlat Kitap. Visitors browse the books and sets and send a pre-order request. There is no payment step, and books ship once printing is done. The full product brief is in `yonerge.md` (Turkish); read it before making UX or design decisions. Code comments, error messages and seed data are in Turkish, so keep new comments in Turkish to match.

The project is in early development. Several files point to code that does not exist yet: the route pages (`/[lang]`, `/[lang]/kitaplar`, `/[lang]/on-siparis`), the `/admin` panel, the `/media/[id]` route that serves uploaded covers, and `scripts/import-books.ts`, which `npm run import:books` expects. Check whether a file exists before you rely on it.

## Commands

```bash
npm run dev          # Next dev server (Turbopack)
npm run build
npm run lint         # eslint (flat config, next core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit

npm run db:generate  # drizzle-kit: generate SQL migration from src/db/schema.ts into drizzle/
npm run db:migrate   # apply migrations
npm run db:studio
npm run db:seed      # upsert sets/books from src/data/seed-data.ts (idempotent, by slug; never touches preorders)
npx tsx scripts/prepare-covers.ts <src-dir> <out-dir> [width=900]   # print CMYK covers → web sRGB JPEG, aspect preserved
```

There is no test suite. To check a change, run `typecheck` and `lint`, and look at it in the running dev server.

Environment variables live in `.env.local` (see `.env.example`): `DATABASE_URL` (Postgres), `ADMIN_PASSWORD`, `SESSION_SECRET` (it also salts the IP hashes used for rate limiting), and optionally `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` for new-order notifications. `drizzle.config.ts` and `scripts/lib/db.ts` load `.env.local` themselves through `process.loadEnvFile`.

## Next.js 16 specifics used here

This project uses Next 16.4 and React 19.3. Some APIs differ from older Next versions:

- **`src/proxy.ts`** takes the place of `middleware.ts`. It redirects paths without a locale prefix to `/tr/...` or `/ug/...`, choosing from the `lang` cookie first and then `Accept-Language`. It keeps the `lang` cookie in sync and sends any `/admin/*` request without the `ewlat_admin` cookie to `/admin/login`. That redirect is only a quick pre-check: the pages and server actions still have to check authorization themselves.
- **`cacheComponents: true`**: data functions use the `"use cache"` directive together with `cacheLife()` and `cacheTag()` from `next/cache`. Catalog reads are tagged `CATALOG_TAG` (`src/lib/queries.ts`). After an admin mutation, call `updateTag(CATALOG_TAG)` so the catalog refreshes.
- **Root params**: there is no `src/app/layout.tsx`. `src/app/[lang]/layout.tsx` is the root layout and renders `<html lang dir>` itself. Code reads the current locale with `lang()` from `next/root-params`, through `getLocale()` in `src/i18n/dictionaries.ts`, rather than from props. `LayoutProps<"/[lang]">` is a global type that Next generates.
- `experimental.globalNotFound` is on, and the server-action body limit is 12 MB to allow cover uploads. `next/image` uses `preload` in place of `priority`, and local images must match `images.localPatterns` (`/covers/**`, `/media/**`).
- Tailwind v4 runs through the `@tailwindcss/turbopack` loader. There is no tailwind config file: design tokens (the cream/linen/paper/sand/ink/umber/walnut palette, the fonts, and the `shadow-soft`/`shadow-lift` shadows) live in `@theme` in `src/app/globals.css`.

## Architecture

**Data layer.** The data lives in PostgreSQL and is accessed through Drizzle (`node-postgres`) with `casing: "snake_case"`. The schema is in `src/db/schema.ts`:
- `sets` and `books` have a many-to-many relationship through `book_sets`, which has a `position` column for a book's order within its set. In the catalog, a book that belongs to more than one set is shown under the set with the lowest `sortOrder`.
- Each book stores its own `cover_width`/`cover_height`, which give its real aspect ratio, and `thickness_mm`. Never force every cover into one aspect ratio. The brief requires each book's real proportions.
- `missing_info text[]` marks fields that are unknown or still need checking (codes are documented at the top of `src/data/seed-data.ts`). The brief says never to invent book titles, translations or set assignments: if something is unknown, add it to `missing_info` and use `isPlaceholder`.
- `preorders` + `preorder_sets` hold orders; `status` is a pg enum. `media` stores uploaded cover images as `bytea`.
- `src/db/index.ts` is `server-only` and keeps one pool across hot reloads. CLI scripts use `scripts/lib/db.ts` instead.
- `src/data/seed-data.ts` is only for the first setup. Afterwards, books are meant to be managed in the admin panel or through a CSV import.

**Reads.** `getCatalog()` loads every visible set and book in a single cached query and returns serializable `Catalog`, `CatalogSet` and `CatalogBook` types (`src/lib/types.ts`). The catalog page, the carousel and the pre-order form's set picker all use it. `getFeaturedBooks()` returns the books marked `is_featured`, for the home page carousel.

**Pre-order write path.** The flow is `src/lib/actions/preorder.ts` (a server action used with `useActionState`), then the zod schema in `src/lib/preorder-schema.ts`, then the insert in a transaction. Along the way it checks a honeypot `website` field, checks that the chosen set IDs exist, and rate-limits each salted IP hash to 5 orders per 10 minutes. Once the order is saved, it sends the Telegram notification from `after()` in `src/lib/notify.ts`. Validation errors come back as codes that match keys under `preorder.errors` in the dictionaries.

**i18n / RTL.** There are two locales, `tr` (LTR, the default) and `ug` (Uyghur in Arabic script, RTL, set in the Lateef font). UI strings live in `src/i18n/dictionaries/{tr,ug}.json`, and `tr.json` defines the `Dictionary` type, so add new keys to both files. For book and set content, use the `bookLabel()` and `setName()` helpers in `src/lib/format.ts`: when a translation is missing they fall back to the other language rather than inventing one, and they flag Uyghur text so it gets RTL direction and the `ug-text` class. Use logical CSS properties (`ms-`, `me-`, `start`, `end`) so layouts mirror correctly in RTL. Uyghur books are bound on the right, so `Book3D` uses `binding="right"` by default.

**3D book rendering.** `src/components/book/Book3D.tsx` sizes each book from its cover ratio and thickness, and passes those sizes to CSS through the `--book-w`, `--book-h` and `--book-t` variables. The 3D faces, the page-edge texture, the shadow and the hover rotation are all pure CSS in the "CSS 3D kitap" section of `globals.css`. No Three.js is involved. The brief asks for subtle, realistic motion, not toy-like effects.

**Assets.** Covers that ship with the site are in `public/covers/<set-slug>/NN.jpg` and are produced from the print originals in `ref_imgs/` with `prepare-covers.ts`. The home page carousel uses Swiper and the icons come from lucide-react.
