# Vexlora — Customer Website Frontend

Production-ready Customer Website frontend for the multi-vendor e-commerce platform built with Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query v5, Axios, Zustand, and Zod.

---

## 🛠️ Architecture & Technology Stack

| Technology | Purpose | Implementation |
| :--- | :--- | :--- |
| **Next.js (App Router)** | Framework (React 19, Turbopack) | [`src/app/`](file:///d:/e-commerce/vexlora/src/app) |
| **Tailwind CSS v4** | Clean White/Light Theme Styling | [`src/app/globals.css`](file:///d:/e-commerce/vexlora/src/app/globals.css) |
| **TanStack Query v5** | Server-State Management & Caching | [`src/lib/query/`](file:///d:/e-commerce/vexlora/src/lib/query) |
| **Axios** | Centralized API Client & Interceptors | [`src/lib/api/client.ts`](file:///d:/e-commerce/vexlora/src/lib/api/client.ts) |
| **Zustand** | Client-Side State with Persistence | [`src/stores/`](file:///d:/e-commerce/vexlora/src/stores) |
| **Zod & React Hook Form** | Runtime Validation & Forms | [`src/schemas/`](file:///d:/e-commerce/vexlora/src/schemas) |
| **Lucide React** | Consistent Iconography | Clean lightweight SVG icons |
| **pnpm** | Package Manager | Fast, deterministic dependencies |

---

## 📁 Project Structure

```
d:\e-commerce\vexlora/
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment configuration
├── package.json                     # Scripts (dev, build, start, lint, typecheck)
├── tsconfig.json                    # Path alias configured for @/*
├── next.config.ts                   # Next.js configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root Layout: QueryProvider, Header, Main, Footer
│   │   ├── page.tsx                 # Clean minimal Home page placeholder
│   │   ├── loading.tsx              # Global loading skeleton (white/light theme)
│   │   ├── error.tsx                # Global error boundary with retry
│   │   ├── not-found.tsx            # Global 404 page
│   │   ├── global-error.tsx         # Catastrophic error fallback
│   │   └── globals.css              # Design system tokens, white/light theme styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx           # Full-width responsive Header / Navbar
│   │   │   ├── navbar.tsx           # Re-export / alias for header
│   │   │   ├── mobile-nav.tsx       # Slide-over mobile drawer
│   │   │   └── footer.tsx           # Full-width responsive Footer with newsletter
│   │   └── ui/                      # Reusable UI primitives (Button, Input, Badge)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts            # Centralized Axios instance with interceptors
│   │   │   └── types.ts             # Envelope interfaces (ApiResponse, ApiError)
│   │   ├── query/
│   │   │   ├── client.ts            # TanStack QueryClient with optimal defaults
│   │   │   ├── provider.tsx         # TanStack Query client provider with devtools
│   │   │   └── keys.ts              # Scalable query key factory
│   │   └── utils.ts                 # Utility functions (cn class merger, formatCurrency)
│   ├── schemas/                     # Base Zod validation schemas
│   │   ├── newsletter.schema.ts     # Footer newsletter subscription schema
│   │   ├── auth.schema.ts           # Customer auth schemas (login, register)
│   │   └── address.schema.ts        # Customer shipping address schema
│   ├── stores/                      # Scalable Zustand stores
│   │   ├── ui.store.ts              # UI state (mobile drawer, search, currency)
│   │   ├── cart.store.ts            # Cart store with persistence
│   │   └── wishlist.store.ts        # Wishlist store with persistence
│   └── types/                       # Shared TypeScript definitions
│       └── common.ts
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Verify `.env.local` contains the backend API endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Code Quality & Build Checks
```bash
# Run TypeScript typecheck
pnpm typecheck

# Run ESLint
pnpm lint

# Production Build
pnpm build
```
