# 12 — TopBarSearch Component

## Problem

The search bar in `app-shell.tsx` (lines 97–100) is a fake, non-interactive `<div>` styled to look like an input:

```tsx
<div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
  <Search className="size-4 shrink-0" />
  <span className="truncate">Search incidents, reports, or citizens...</span>
</div>
```

Issues:
- It's a `<div>`, not a real `<input>` — not accessible, not interactive
- No keyboard focus, no search functionality hook-in
- Screen readers cannot identify this as a search field
- The shadcn `Input` component (with the right icon wrapper) produces the same visual appearance but with correct semantics

---

## Solution: `TopBarSearch`

**File to create:** `apps/web/src/components/top-bar-search.tsx`

**Shadcn primitives to install:**
- `input` → `pnpm dlx shadcn@latest add input -c apps/web`

### Props interface

```tsx
export interface TopBarSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}
```

### Pseudocode

```tsx
import { Input } from "@workspace/ui/components/input"

export function TopBarSearch({ onSearch, placeholder, className }: TopBarSearchProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        role="searchbox"
        aria-label="Search incidents, reports, or citizens"
        placeholder={placeholder ?? "Search incidents, reports, or citizens..."}
        className="bg-muted pl-9 text-sm placeholder:text-muted-foreground"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  )
}
```

### Why icon-left pattern

The shadcn `Input` does not have a built-in icon slot. The standard pattern is to use relative positioning with an absolute icon overlay — matching what the current design already implies visually.

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `app-shell.tsx` | 97–100 — fake `<div>` search bar |

---

## Files changed

| File | Change |
|------|--------|
| `packages/ui/src/components/input.tsx` | **[NEW via shadcn install]** |
| `apps/web/src/components/top-bar-search.tsx` | **[NEW]** |
| `apps/web/src/components/app-shell.tsx` | Replace `<div>` with `<TopBarSearch />` |

## Visual preservation

- Same `max-w-md` width
- Same `bg-muted` background
- Same `border border-input` border
- Same `Search` icon on the left
- Same placeholder text
- `px-3 py-2` sizing — shadcn Input has `h-9 px-3 py-1` by default; needs `py-2` class override or the `sm` size variant to match the current height exactly

> [!NOTE]
> The `Input` height may need minor adjustment. The current `<div>` uses `py-2` which gives ~40px height. Shadcn's default `Input` is `h-9` (36px). Pass `className="h-auto py-2"` to match.
