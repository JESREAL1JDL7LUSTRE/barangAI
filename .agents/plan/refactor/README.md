# Shadcn Refactor Plans — Index

This directory contains granular planning documents for converting raw HTML patterns 
in the LihokBarangAI frontend to reusable components backed by shadcn/ui primitives.

## Rules
- **UI must be visually preserved** — the refactor is structural/code quality only
- All colour tokens stay through CSS variables (`--lihok-*`, `--urgency-*`, etc.)
- shadcn components are installed to `packages/ui/src/components/`
- Reusable app components live in `apps/web/src/components/`
- Install command: `pnpm dlx shadcn@latest add <name> -c apps/web`
- Import path: `@workspace/ui/components/<name>`

## Documents in this folder

| File | What it covers |
|------|---------------|
| [01-shadcn-install-list.md](./01-shadcn-install-list.md) | Every shadcn primitive to install + rationale |
| [02-urgency-badge.md](./02-urgency-badge.md) | `UrgencyBadge` — replaces 6 inline urgency span patterns |
| [03-category-bar.md](./03-category-bar.md) | `CategoryBar` — replaces progress-bar rows in Dashboard + Reports |
| [04-section-card.md](./04-section-card.md) | `SectionCard` — replaces repeated `<article>` card shells |
| [05-incident-row.md](./05-incident-row.md) | `IncidentRow` — replaces incident list items in Dashboard + Incidents |
| [06-sms-feed-table.md](./06-sms-feed-table.md) | `SmsFeedTable` — replaces the raw `<table>` in Command Center |
| [07-system-log-feed.md](./07-system-log-feed.md) | `SystemLogFeed` — replaces log dot-list in Dashboard + Command Center |
| [08-personnel-card.md](./08-personnel-card.md) | `PersonnelCard` — replaces personnel unit articles in Map |
| [09-ai-urgency-panel.md](./09-ai-urgency-panel.md) | `AiUrgencyPanel` — wraps AI score + progress in Command Center |
| [10-broadcast-form.md](./10-broadcast-form.md) | `BroadcastForm` — wraps textarea + send button in Command Center |
| [11-heat-zone-cell.md](./11-heat-zone-cell.md) | `HeatZoneCell` — replaces heatmap buttons in Reports |
| [12-topbar-search.md](./12-topbar-search.md) | `TopBarSearch` — upgrades search input in AppShell |
| [13-time-range-toggle.md](./13-time-range-toggle.md) | `TimeRangeToggle` — replaces manual toggle in Reports |

## Execution order

```
Phase 1 (primitives, no UI change):
  Install → 01-shadcn-install-list.md

Phase 2 (atoms — used inside compound components):
  02 UrgencyBadge
  03 CategoryBar
  04 SectionCard

Phase 3 (molecules — compose atoms):
  05 IncidentRow      (uses UrgencyBadge + SectionCard)
  06 SmsFeedTable     (uses Badge)
  07 SystemLogFeed    (uses SectionCard)
  08 PersonnelCard    (uses Badge)
  09 AiUrgencyPanel   (uses SectionCard + Progress)
  10 BroadcastForm    (uses Textarea + Button)
  11 HeatZoneCell
  12 TopBarSearch
  13 TimeRangeToggle  (uses Tabs or ToggleGroup)
```
