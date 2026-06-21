# 10 — BroadcastForm Component

## Problem

The Citizen Update Loop in `command-center.$incidentId.tsx` (lines 135–151) uses raw HTML `<textarea>` and `<button>` — not the shadcn `Textarea`, `Label`, or `Button` components:

```tsx
<section className="rounded-xl border border-border bg-card p-6 shadow-sm">
  <h2 className="flex items-center gap-2 text-lg font-bold">
    <Megaphone className="size-5 text-primary" />
    Citizen Update Loop
  </h2>
  <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
    Broadcast Message
  </label>
  <textarea
    className="mt-2 min-h-28 w-full resize-none rounded-lg border border-input bg-muted p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    defaultValue="Alert: Zone 4 residents, please avoid the main intersection..."
  />
  <button className="mt-4 w-full rounded-lg bg-lihok-accent px-5 py-3 text-sm font-black text-lihok-ink transition-opacity hover:opacity-90">
    Send Alert
  </button>
</section>
```

Issues:
- Raw `<textarea>` lacks the shadcn `Textarea` component (which includes proper focus-ring via `ring` token)
- Raw `<button>` lacks the shadcn `Button` component (focus-visible ring, disabled state handling)
- Raw `<label>` lacks the shadcn `Label` component (which links to the input via `for`/`htmlFor` properly)
- No `onSend` callback — the button is purely decorative
- No loading/disabled state for when a send is in progress
- The section shell is the same card pattern `SectionCard` handles

---

## Solution: `BroadcastForm`

**File to create:** `apps/web/src/components/broadcast-form.tsx`

**Shadcn primitives to install first:**
- `textarea` → `pnpm dlx shadcn@latest add textarea -c apps/web`
- `label` → `pnpm dlx shadcn@latest add label -c apps/web`

**Shadcn primitives already installed:**
- `Button`
- `SectionCard` (from [04-section-card.md](./04-section-card.md))

### Props interface

```tsx
export interface BroadcastFormProps {
  incidentId: string
  defaultMessage?: string
  onSend?: (message: string) => Promise<void>
  className?: string
}
```

### Pseudocode

```tsx
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { SectionCard } from "@/components/section-card"

export function BroadcastForm({
  incidentId,
  defaultMessage = "",
  onSend,
  className,
}: BroadcastFormProps) {
  const [message, setMessage] = useState(defaultMessage)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!onSend || !message.trim()) return
    setSending(true)
    try {
      await onSend(message)
    } finally {
      setSending(false)
    }
  }

  const fieldId = `broadcast-${incidentId}`

  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          Citizen Update Loop
        </span>
      }
      className={className}
    >
      <Label
        htmlFor={fieldId}
        className="mt-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground"
      >
        Broadcast Message
      </Label>
      <Textarea
        id={fieldId}
        className="mt-2 min-h-28 resize-none bg-muted text-sm"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your alert message..."
      />
      <Button
        className="mt-4 w-full bg-lihok-accent font-black text-lihok-ink hover:bg-lihok-accent/90"
        disabled={sending || !message.trim()}
        onClick={handleSend}
      >
        {sending ? "Sending..." : "Send Alert"}
      </Button>
    </SectionCard>
  )
}
```

### What this unlocks

- The `onSend` prop provides the hook-in point for the real Supabase broadcast call when Supabase hooks are implemented
- `disabled` state prevents double-sends
- `htmlFor` properly links label to textarea for screen readers
- The shadcn `Textarea` automatically applies the correct focus ring via `ring` token
- `Button` provides keyboard focus-visible ring (WCAG 2.1 compliance)

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `command-center.$incidentId.tsx` | 135–151 — entire broadcast section |

---

## Files changed

| File | Change |
|------|--------|
| `packages/ui/src/components/textarea.tsx` | **[NEW via shadcn install]** |
| `packages/ui/src/components/label.tsx` | **[NEW via shadcn install]** |
| `apps/web/src/components/broadcast-form.tsx` | **[NEW]** |
| `apps/web/src/routes/command-center.$incidentId.tsx` | Replace broadcast section with `<BroadcastForm incidentId={incidentId} />` |

## Visual preservation

- `Textarea` with `bg-muted` class — same background as current `<textarea className="bg-muted">`
- `Button` with `bg-lihok-accent` override — same accent colour
- `Label` uppercase tracking wide — same visual style, just semantic HTML
