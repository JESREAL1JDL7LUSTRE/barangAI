# 01 — Shadcn Primitives: Install List

> Every shadcn/ui component that needs to be installed before the refactor begins.
> All installs go to `packages/ui/src/components/` via the monorepo command.

## Install Command Template

```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

---

## Already Installed ✅

| Component | Location | Used by |
|-----------|----------|---------|
| `button` | `packages/ui/src/components/button.tsx` | AppShell sign-out |
| `card` | `packages/ui/src/components/card.tsx` | `StatCard` |
| `progress` | `packages/ui/src/components/progress.tsx` | `StatCard`, AI urgency panel |
| `badge` | `packages/ui/src/components/badge.tsx` | *(installed, not yet used)* |

---

## To Install 🔲

### Group A — Text & Form Primitives

| Component | Install command | Used by |
|-----------|----------------|---------|
| `separator` | `pnpm dlx shadcn@latest add separator -c apps/web` | `SectionCard` dividers, incident list dividers |
| `textarea` | `pnpm dlx shadcn@latest add textarea -c apps/web` | `BroadcastForm` |
| `input` | `pnpm dlx shadcn@latest add input -c apps/web` | `TopBarSearch` |
| `label` | `pnpm dlx shadcn@latest add label -c apps/web` | `BroadcastForm` field label |

### Group B — Layout & Data Display

| Component | Install command | Used by |
|-----------|----------------|---------|
| `table` | `pnpm dlx shadcn@latest add table -c apps/web` | `SmsFeedTable` |
| `scroll-area` | `pnpm dlx shadcn@latest add scroll-area -c apps/web` | `SystemLogFeed`, `SmsFeedTable` (overflow) |
| `tooltip` | `pnpm dlx shadcn@latest add tooltip -c apps/web` | `PersonnelCard` action button, map controls |

### Group C — Toggle / Selection

| Component | Install command | Used by |
|-----------|----------------|---------|
| `toggle-group` | `pnpm dlx shadcn@latest add toggle-group -c apps/web` | `TimeRangeToggle` (replaces manual button loop) |

### Group D — Feedback

| Component | Install command | Used by |
|-----------|----------------|---------|
| `skeleton` | `pnpm dlx shadcn@latest add skeleton -c apps/web` | Future: loading states for all card/table components |

---

## Batch Install Command (all at once)

```bash
pnpm dlx shadcn@latest add separator textarea input label table scroll-area tooltip toggle-group skeleton -c apps/web
```

---

## What NOT to install

| Component | Reason to skip |
|-----------|---------------|
| `dialog` / `sheet` | No modal patterns exist yet — defer to Phase 2 feature work |
| `dropdown-menu` | Only 1 potential use (user avatar menu) — not enough recurrence to justify now |
| `select` | No select inputs in current UI |
| `navigation-menu` | Sidebar is custom — shadcn nav-menu is desktop-tab oriented, doesn't fit |
| `sidebar` | shadcn sidebar component uses a completely different layout model than what is built |
| `tabs` | `toggle-group` fits the time-range toggle better; tabs would overhaul layout |
| `chart` | Tremor already provides charts — don't duplicate |
| `sonner` | Toast library — useful later, not in current UI scope |
| `alert` | Only 1 instance (live alert bar) and it's custom-themed — don't break it |

---

## Notes on `badge`

The installed `Badge` component currently uses `bg-primary` as its default variant, which maps to the dark green. The urgency badge needs **custom variants** extending `badgeVariants`. This is planned in [02-urgency-badge.md](./02-urgency-badge.md) — it **extends** the existing badge, does NOT replace it.
