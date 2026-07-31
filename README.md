# Aurora DSI — Data Security Intelligence

**Discover. Classify. Protect.**

Aurora DSI is an enterprise data security intelligence platform that helps security teams discover, classify, investigate, and govern sensitive organizational data across cloud, SaaS, databases, and on-prem repositories.

**Core philosophy:** _AI Explains. Humans Decide._ Aurora never performs autonomous remediation.

This repository contains the **complete application shell** — the permanent architecture and design foundation onto which all future business functionality is layered. No later sprint should need to redesign the shell, layout, routing, or design system.

---

## Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| Data tables | TanStack Table |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animation | Framer Motion (subtle interactions only) |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── App.tsx                  # Minimal: providers + router only
├── main.tsx                 # Entry point
├── index.css                # Design tokens (light/dark), Inter font, utilities
│
├── types/                   # Shared TypeScript domain types
│   └── index.ts             #   User, Repository, Detection, Scan, Policy, …
│
├── mock-data/               # Centralized mock backend (single source of truth)
│   └── index.ts             #   Org, users, repos, detections, scans, policies, activity, notifications, metrics
│
├── contexts/                # Global React contexts
│   ├── AuthContext.tsx      #   Mock login, session persistence (localStorage/sessionStorage)
│   ├── ThemeContext.tsx     #   Light/dark mode, persisted
│   └── NotificationsContext.tsx  # Notification bell state
│
├── utils/                   # Pure helpers
│   ├── format.ts            #   Number, date, risk-score formatting
│   └── navigation.ts        #   Sidebar nav items config
│
├── components/
│   ├── ui/                  # shadcn/ui primitives (unchanged)
│   ├── common/              # Reusable Aurora building blocks (see below)
│   └── layout/              # App shell: Sidebar, TopNav, AppLayout, WorkspaceSwitcher, …
│
└── pages/                   # One file per route
    ├── LoginPage.tsx
    ├── OverviewPage.tsx     # Fully built landing experience
    ├── DetectionsPage.tsx
    ├── DataSourcesPage.tsx
    ├── ScanManagementPage.tsx
    ├── PoliciesPage.tsx
    ├── InsightsPage.tsx
    ├── SettingsPage.tsx
    ├── HelpPage.tsx
    └── NotFoundPage.tsx
```

### Reusable components (`src/components/common/`)

Every page composes from these shared primitives — no duplication:

| Component | Purpose |
| --- | --- |
| `PageContainer` | Max-width 1600px scroll wrapper |
| `PageHeader` | Icon + title + description + action slot |
| `SectionHeader` | In-page section title/description/action |
| `MetricCard` | KPI card with sparkline + trend delta |
| `StatusBadge` | Entity status pill (active, scanning, open, …) |
| `RiskBadge` / `RiskScoreBadge` | Severity + risk-level pills |
| `Badge` | Generic colored badge |
| `PrimaryButton` / `SecondaryButton` | Themed buttons with optional `to` link |
| `SearchInput` | Search field with clear button |
| `FilterBar` | Segmented filter chips with counts |
| `EmptyState` | Illustrated empty-state block |
| `LoadingSkeleton` / `MetricSkeleton` / `TableSkeleton` | Loading states |
| `Drawer` | Right-side slide-over detail panel |
| `DataTable` | TanStack-powered sortable, searchable table |
| `Timeline` / `ActivityItem` | Vertical activity feed |
| `ComingSoon` | Standardized "module arriving" page layout |

All are exported from `src/components/common/index.ts`.

---

## Design System

- **Font:** Inter (loaded via Google Fonts in `index.css`)
- **Background:** `#F8FAFC` light / deep navy dark
- **Cards:** white (light) / elevated navy (dark)
- **Primary:** `#4F46E5` · **Success:** `#16A34A` · **Warning:** `#D97706` · **Danger:** `#DC2626`
- Color tokens live as CSS custom properties in `src/index.css` and are mapped in `tailwind.config.js`, enabling full light/dark theming. Use `useTheme()` to toggle.
- 8px spacing system, `0.625rem` border radius, layered shadows defined in Tailwind config.

---

## Authentication

Mock-only. The login page (`/login`) accepts any non-empty organization/email/password and signs you in as **Sarah Johnson** (Security Analyst) at **Acme Financial Services Ltd.**

- `Remember me` persists to `localStorage`; otherwise `sessionStorage`.
- `AuthContext` exposes `isAuthenticated`, `login`, `logout`, `switchWorkspace`, `user`, `workspace`.
- Route guards (`ProtectedRoute` / `PublicRoute`) redirect unauthenticated users to `/login` and authenticated users away from it.

---

## Routes

| Path | Page |
| --- | --- |
| `/login` | Enterprise login (public) |
| `/overview` | Security posture overview (fully built) |
| `/detections` | Detections — Coming Soon |
| `/data-sources` | Data Sources — Coming Soon |
| `/scan-management` | Scan Management — Coming Soon |
| `/policies` | Policies — Coming Soon |
| `/insights` | AI Insights — Coming Soon |
| `/settings` | Workspace Settings — Coming Soon |
| `/help` | Help & Documentation (fully built) |
| `*` | 404 |

Every route exists and renders meaningful content — nothing is blank.

---

## How to Add Future Features (without changing the architecture)

The shell is designed so that future sprints fill in the "Coming Soon" pages without touching the foundation:

1. **New page content** — Replace the `ComingSoon` component inside a page file (e.g. `src/pages/DetectionsPage.tsx`) with real UI composed from the existing common components. The route, sidebar entry, and layout already work.

2. **New route** — Add a `<Route>` in `src/App.tsx`, add a nav item to `src/utils/navigation.ts`, and create the page file in `src/pages/`.

3. **New data** — Add typed mock records to `src/mock-data/index.ts` and domain types to `src/types/index.ts`. When wiring a real backend, swap the mock-data imports for React Query hooks — the component contracts stay identical.

4. **New reusable component** — Add it under `src/components/common/` and export from `index.ts`. Reuse before adding.

5. **Real authentication** — Replace the mock logic inside `AuthContext.tsx`; the `useAuth()` contract (login/logout/session) stays the same, so no page changes are needed.

No existing file in `components/layout`, `contexts`, `utils`, or the design system needs to change for feature work.

---

## Getting Started

```bash
npm install      # install dependencies
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # eslint
npm run typecheck
```

Sign in on the login page with any values (organization is pre-filled). Use the top-right icons to toggle theme, view notifications, or open the command palette (`Cmd/Ctrl + K`).
