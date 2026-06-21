-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: believability
-- Adds columns to track if the LLM thinks a report is realistic or a prank.
-- ─────────────────────────────────────────────────────────────────────────────

alter table reports
  add column is_realistic boolean not null default true,
  add column unrealistic_reason text;

-- Index for filtering out prank/spam reports in the dashboard
create index idx_reports_realistic on reports (is_realistic);
