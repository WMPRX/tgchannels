# TGChannels

A community directory platform for discovering and sharing WhatsApp groups/channels, Telegram groups/channels, and Discord servers.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5 (Google OAuth + Email/Password)
- **Styling:** Tailwind CSS + dark mode
- **i18n:** next-intl (7 languages: TR, EN, AZ, DE, RU, HI, AR)
- **Cache:** Redis (ioredis) for rate limiting + view throttling
- **Runtime:** Node.js 22

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL 15+
- Redis 7+ (optional — app degrades gracefully)

### 1. Clone & Install

```bash
git clone https://github.com/wmprx/tgchannels.git
cd tgchannels
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret (run `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `REDIS_URL` | Redis connection string (optional) |

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# Seed with categories + sample groups
pnpm prisma:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker Compose (PostgreSQL + Redis)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

Default `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5432/tgchannels`
Default `REDIS_URL`: `redis://localhost:6379`

## Default Admin Account

After seeding, log in with:
- **Email:** admin@tgchannels.com
- **Password:** Admin123!

Navigate to `/tr/admin` to access the admin panel.

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-prefixed pages
│   │   ├── page.tsx        # Home
│   │   ├── add/            # Add group form
│   │   ├── login/          # Auth page
│   │   ├── panel/          # User panel
│   │   ├── admin/          # Admin panel
│   │   ├── [platform-slug]/# Platform listing pages
│   │   └── ...             # Static pages (about, faq, etc.)
│   ├── api/                # API routes
│   └── group/[id]/         # Group detail (locale-agnostic)
├── components/
│   ├── layout/             # Header, Footer, BottomNav, Sidebar
│   ├── groups/             # GroupCard, PlatformCard, modals
│   ├── forms/              # AddGroupForm, LoginForm
│   ├── admin/              # Admin components
│   ├── ui/                 # Base UI components
│   └── providers/          # ThemeProvider
├── lib/
│   ├── prisma.ts           # DB client singleton
│   ├── redis.ts            # Redis client singleton
│   ├── auth.ts             # NextAuth config
│   └── utils.ts            # Helpers
├── i18n/                   # Translation JSON files
├── types/                  # TypeScript interfaces
└── middleware.ts            # next-intl locale routing
```

## Supported Platforms

| Platform | URL Slug (TR) | URL Slug (EN) |
|---|---|---|
| WhatsApp Groups | `/whatsapp-gruplari` | `/whatsapp-groups` |
| WhatsApp Channels | `/whatsapp-kanallari` | `/whatsapp-channels` |
| Telegram Groups | `/telegram-gruplari` | `/telegram-groups` |
| Telegram Channels | `/telegram-kanallari` | `/telegram-channels` |
| Discord Servers | `/discord-sunuculari` | `/discord-servers` |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/groups` | List groups (filter by platform/category/sort) |
| POST | `/api/groups` | Create group (auth required) |
| GET | `/api/groups/:id` | Get single group |
| PATCH | `/api/groups/:id/view` | Increment view count (IP throttled) |
| POST | `/api/groups/:id/report` | Submit report |
| GET | `/api/categories` | List categories with translations |
| GET | `/api/sponsors` | List active sponsor links |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| PATCH | `/api/admin/groups/:id/approve` | Approve group (admin) |
| PATCH | `/api/admin/groups/:id/reject` | Reject group (admin) |

## Build for Production

```bash
pnpm build
pnpm start
```

## License

MIT
