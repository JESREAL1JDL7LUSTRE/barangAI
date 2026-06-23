# 06 — SmsFeedTable Component

## Problem

The Raw SMS Feed in `command-center.$incidentId.tsx` (lines 75–105) is a raw HTML `<table>` with manual `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements and no semantic shadcn structure:

```tsx
<div className="overflow-hidden rounded-lg border border-border">
  <table className="w-full min-w-[680px] text-left text-sm">
    <thead className="bg-muted text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      <tr>
        <th className="p-4">Timestamp</th>
        <th className="p-4">Origin</th>
        <th className="p-4">Message Content</th>
        <th className="p-4">Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      {smsFeed.map((sms) => (
        <tr key={sms.timestamp} className="transition-colors hover:bg-muted/50">
          <td className="p-4 font-medium">{sms.timestamp}</td>
          <td className="p-4 font-bold">{sms.origin}</td>
          <td className="p-4 text-foreground/80">{sms.content}</td>
          <td className="p-4">
            <span className={cn(
              "rounded px-2 py-1 text-[10px] font-black uppercase",
              statusClass[sms.status] ?? statusClass.processing,
            )}>
              {sms.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

Issues:
- No ARIA table semantics from shadcn
- `statusClass` record is a local magic string map, not typed
- Status badge shares the same pattern as urgency badges but uses `statusClass` instead — inconsistent
- `ScrollArea` not used — table overflows with raw `min-w-[680px]`

---

## Solution: `SmsFeedTable`

**File to create:** `apps/web/src/components/sms-feed-table.tsx`

**Shadcn primitives to install first:**
- `table` → `pnpm dlx shadcn@latest add table -c apps/web`
- `scroll-area` → `pnpm dlx shadcn@latest add scroll-area -c apps/web`

**Dependencies:** `UrgencyBadge` / status badge pattern from [02-urgency-badge.md](./02-urgency-badge.md)

### Data type

```tsx
export type SmsStatus = "verified" | "processing" | "pending"

export interface SmsEntry {
  timestamp: string
  origin: string
  content: string
  status: SmsStatus
}
```

### Props interface

```tsx
export interface SmsFeedTableProps {
  entries: SmsEntry[]
  className?: string
}
```

### Pseudocode

```tsx
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@workspace/ui/components/table"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

const statusVariant: Record<SmsStatus, string> = {
  verified:   "bg-status-verified/20 text-lihok-ink",
  processing: "bg-status-processing/20 text-urgency-medium",
  pending:    "bg-muted text-muted-foreground",
}

export function SmsFeedTable({ entries, className }: SmsFeedTableProps) {
  return (
    <ScrollArea className={cn("rounded-lg border border-border", className)}>
      <Table className="min-w-[680px]">
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead>Timestamp</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Message Content</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((sms) => (
            <TableRow key={sms.timestamp}>
              <TableCell className="font-medium">{sms.timestamp}</TableCell>
              <TableCell className="font-bold">{sms.origin}</TableCell>
              <TableCell className="text-foreground/80">{sms.content}</TableCell>
              <TableCell>
                <span className={cn(
                  "rounded px-2 py-1 text-[10px] font-black uppercase",
                  statusVariant[sms.status],
                )}>
                  {sms.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
```

### Benefits of shadcn Table

- `TableHead` automatically applies `text-muted-foreground font-medium` etc.
- `TableRow` handles hover states and dividers natively
- `ScrollArea` replaces the raw overflow container with a styled scrollbar
- TypeScript type for `SmsStatus` replaces the loosely-typed `string` status

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `command-center.$incidentId.tsx` | 70–106 — entire SMS feed div+table block |

---

## Files changed

| File | Change |
|------|--------|
| `packages/ui/src/components/table.tsx` | **[NEW via shadcn install]** |
| `packages/ui/src/components/scroll-area.tsx` | **[NEW via shadcn install]** |
| `apps/web/src/components/sms-feed-table.tsx` | **[NEW]** |
| `apps/web/src/routes/command-center.$incidentId.tsx` | Replace raw table block with `<SmsFeedTable entries={smsFeed} />` |
| `apps/web/src/lib/mock-data.ts` | Add `SmsStatus` type annotation to `smsFeed` entries |

## Visual preservation

The shadcn `TableHead` / `TableCell` default to `p-4` padding which matches existing `<th className="p-4">` / `<td className="p-4">` — identical spacing.
