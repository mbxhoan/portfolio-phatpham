# Phạm Minh Phát — Portfolio

Personal portfolio website for **Phạm Minh Phát** (Business Analyst), built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and a small **shadcn/ui-style** component layer. Responsive, SEO-ready, and production-ready.

## ✨ One file to edit everything

> **All site content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).**

Open that file to change your name, tagline, fields of work, capabilities, tools, the collaboration process, projects (with case-study detail), social links, and the demo admin content. No CMS, no database. Icons are chosen by name from the `IconName` union in `src/types/portfolio.ts` (see `src/lib/icon-map.tsx` for the full list), so the data file stays free of JSX.

## 🚀 Getting started

```bash
npm install      # or pnpm install / yarn
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## 🗺 Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, fields of work, featured projects, collaboration timeline, CTA |
| `/nang-luc` | Capabilities — professional skills + tools |
| `/du-an` | Projects — searchable, filterable, paginated grid |
| `/du-an/[slug]` | Project detail — full case study (statically generated per project) |
| `/lien-he` | Contact — form opens the visitor's mail client (mailto) |
| `/admin` | Demo admin dashboard (Tổng quan, Giới thiệu, Năng lực, Dự án, Tin nhắn) |

The **admin** area is a clickable front-end demo (CRUD with modals, toasts and delete confirmation) that mirrors the original Figma CMS. It is excluded from search engines (`robots` + `noindex`).

- **Login** — `/admin` is gated by a login. Sign in with username **`admin`** (or email **`admin@example.vn`**) and the password set in `ADMIN_PASSWORD`. The password is verified server-side (`/api/login`) and a valid session is stored in an httpOnly cookie — it is **not** shipped in the client bundle (`src/lib/auth.tsx`, `src/lib/admin-auth.ts`). If `ADMIN_PASSWORD` is unset it falls back to the demo `12345678`; set a real one before sharing.
- **Editable content** — admin edits to text, the hero portrait, per-project images, and the OG image / favicon are saved on the server as a single `portfolio.json` blob (**Vercel Blob**) and layered over `portfolio.ts`, so they show on **every device**, not just the browser that made the edit (`src/lib/store.tsx`, `src/lib/blob.ts`). Uploaded images are downscaled/compressed client-side (`src/lib/image.ts`), then stored as separate public blobs (`/api/upload`); the JSON only references their URLs. Use **Giới thiệu → Khôi phục mặc định** to reset to defaults (for all devices).

The public site is still server-rendered from `portfolio.ts` (SEO/first paint); the store fetches the saved override after hydration and applies it. Without a Blob store configured, reads fall back to the built-in defaults and writes are rejected — see Deployment.

## 🔍 SEO

- Per-page `metadata` (title template, description, Open Graph, Twitter).
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- Set your production domain in **`src/lib/site.ts`** (`siteConfig.url`) before deploying.
- Add an Open Graph image at `public/og.png` (1200×630).

## 🎨 Design tokens

Brand palette and type scale are defined in `tailwind.config.ts` (navy `#000B60`, action blue `#004AC6`, surfaces, etc.) and `src/app/globals.css`. Fonts: **Manrope** (display) + **Inter** (body), loaded via `next/font`.

The hero portrait is a neutral placeholder (`src/components/site/portrait.tsx`). The quickest way to swap it is **/admin → Giới thiệu → Ảnh đại diện** (uploads are stored in Vercel Blob and shown on every device). For a permanent, optimized photo, set `person.photo` in `portfolio.ts` or replace the component's inner block with a `next/image`.

## 🌐 Internationalization

Content is Vietnamese, kept in one typed data file. Because every string flows through `portfolio.ts` / `src/lib/site.ts`, adding `next-intl` (or similar) later is straightforward — swap the single data object for a locale-keyed map.

## 📦 Deployment

Deploy to **Vercel** (recommended): push to a Git repo and import.

For the editable CMS (image uploads + cross-device content) you need a Blob store and an admin password:

1. **Create a Blob store** — Vercel → your project → **Storage** → **Create** → **Blob** → connect it to the project. This injects `BLOB_READ_WRITE_TOKEN` automatically.
2. **Set the admin password** — Project → **Settings → Environment Variables** → add `ADMIN_PASSWORD` (all environments).
3. **Redeploy** so the new env vars take effect.
4. **Local dev** — `vercel link` then `vercel env pull .env.local` to get the token locally (see `.env.example`). Without it, the site renders the built-in defaults and saving is disabled.

> Note: uploaded images get unique URLs, so replacing the hero photo leaves the old blob in storage (harmless, minor cost). Re-upload your portrait once after the first deploy — earlier edits made before this setup lived only in your browser and won't appear on the server.

---

© Phạm Minh Phát · Powered by SECRECT TEAM
