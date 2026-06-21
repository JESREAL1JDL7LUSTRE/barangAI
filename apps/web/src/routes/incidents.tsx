import { createFileRoute } from "@tanstack/react-router"

import { recentIncidents } from "@/lib/mock-data"
import { IncidentRow } from "@/components/incident-row"

export const Route = createFileRoute("/incidents")({ component: Incidents })

function Incidents() {
  return (
    <main className="min-h-full bg-lihok-surface p-8 text-lihok-ink">
      <h1 className="text-2xl font-black tracking-[-0.04em]">Incidents</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentIncidents.map((incident) => (
          <IncidentRow
            key={incident.id}
            id={incident.id}
            title={incident.title}
            location={incident.location}
            urgency={incident.urgency as any}
            timeAgo={incident.timeAgo}
            variant="card"
          />
        ))}
      </div>
    </main>
  )
}
