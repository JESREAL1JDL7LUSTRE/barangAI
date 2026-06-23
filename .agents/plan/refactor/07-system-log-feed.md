# 07 — SystemLogFeed Component

## Problem

The system log dot-list pattern appears **twice** with slightly different markup:

```tsx
// dashboard.tsx — System Logs card (lines 128–139)
<div className="mt-4 grid gap-4">
  {logs.map((log) => (
    <div
      key={log.message}
      className="grid grid-cols-[8px_1fr_auto] items-start gap-3 text-xs"
    >
      <span className="mt-1.5 size-2 rounded-full bg-primary" />
      <p className="text-foreground/80">{log.message}</p>
      <span className="text-muted-foreground">{log.timeAgo}</span>
    </div>
  ))}
</div>

// command-center.$incidentId.tsx — System Log aside (lines 158–165)
<div className="mt-4 grid gap-4 text-xs text-muted-foreground">
  {logs.map((log) => (
    <p key={log.message}>
      {log.message}
      <span className="float-right">{log.timeAgo}</span>
    </p>
  ))}
</div>
```

The command-center version is a simpler, more compact style (just text, no dot). But both are "system logs" and should share a component with a `compact` toggle.

---

## Solution: `SystemLogFeed`

**File to create:** `apps/web/src/components/system-log-feed.tsx`

**Shadcn primitives:** `ScrollArea` (install via `scroll-area`)

### Data type (update `mock-data.ts`)

```tsx
export interface LogEntry {
  message: string
  timeAgo: string
  type?: "dispatch" | "system" | "alert"  // for future colour coding
}
```

### Props interface

```tsx
export interface SystemLogFeedProps {
  entries: LogEntry[]
  /** "dotted" = dashboard style with bullet dot, "plain" = command center style */
  variant?: "dotted" | "plain"
  maxHeight?: string   // for ScrollArea — e.g. "200px"
  className?: string
}
```

### Pseudocode

```tsx
export function SystemLogFeed({
  entries,
  variant = "dotted",
  maxHeight,
  className,
}: SystemLogFeedProps) {
  const content = (
    <div className={cn("grid gap-4 text-xs", className)}>
      {entries.map((log) =>
        variant === "dotted" ? (
          <div key={log.message} className="grid grid-cols-[8px_1fr_auto] items-start gap-3">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
            <p className="text-foreground/80">{log.message}</p>
            <span className="text-muted-foreground">{log.timeAgo}</span>
          </div>
        ) : (
          <div key={log.message} className="flex items-start justify-between gap-4 text-muted-foreground">
            <p>{log.message}</p>
            <span className="shrink-0">{log.timeAgo}</span>
          </div>
        )
      )}
    </div>
  )

  if (maxHeight) {
    return <ScrollArea style={{ maxHeight }}>{content}</ScrollArea>
  }

  return content
}
```

### Why `ScrollArea`?

If the log grows beyond the visible area (real Supabase data will be longer than 3 mock entries), raw `overflow-auto` produces a native scrollbar that often looks inconsistent across OSes. `ScrollArea` provides a styled, consistent overlay scrollbar.

---

## Where it replaces existing code

| File | Line(s) | Variant |
|------|---------|---------|
| `dashboard.tsx` | 128–139 | `variant="dotted"` |
| `command-center.$incidentId.tsx` | 158–165 | `variant="plain"` |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/system-log-feed.tsx` | **[NEW]** |
| `apps/web/src/routes/dashboard.tsx` | Replace raw log div with `<SystemLogFeed variant="dotted" entries={logs} />` |
| `apps/web/src/routes/command-center.$incidentId.tsx` | Replace raw p-loop with `<SystemLogFeed variant="plain" entries={logs} />` |

## Visual preservation

- `variant="dotted"` preserves: `grid-cols-[8px_1fr_auto]`, `size-2 rounded-full bg-primary`, same gap/text classes
- `variant="plain"` preserves: `text-muted-foreground`, same flex row with time on the right
- The `float-right` trick in the original command center version is replaced with `flex justify-between` — same visual result, better semantics
