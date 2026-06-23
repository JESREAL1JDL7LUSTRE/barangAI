import { Search } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

export interface TopBarSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function TopBarSearch({ onSearch, placeholder, className }: TopBarSearchProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        role="searchbox"
        aria-label="Search incidents, reports, or citizens"
        placeholder={placeholder ?? "Search incidents, reports, or citizens..."}
        className="h-auto bg-muted py-2 pl-9 text-sm placeholder:text-muted-foreground"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  )
}
