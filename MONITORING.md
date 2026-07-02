# CRM-Central — Build Monitoring Charter

This branch (`claude/crm-central-review-3vgyug`) is the **review/monitoring** branch.
Every change pushed to this repository by the builder session is audited against the
standards below. Changes that violate a **[BLOCKER]** rule receive a REQUIRED CHANGES
intervention (GitHub review/issue with exact fix commands) and must not ship until resolved.

## 1. Security — endpoints & access

- **[BLOCKER]** Every API endpoint must require authentication by default. Public
  (unauthenticated) routes must be an explicit, documented allowlist (e.g. `/health`, login).
- **[BLOCKER]** All ingress must go through a Cloudflare Tunnel (`cloudflared`) — no
  directly exposed origin ports. The origin must only accept traffic from the tunnel
  (bind to localhost / private network), and admin surfaces must sit behind Cloudflare
  Access policies.
- **[BLOCKER]** Every request body, query param, and path param must be validated
  server-side with a schema (e.g. zod/joi/pydantic) before touching business logic or
  the database. No string-concatenated SQL — parameterized queries / ORM only.
- Rate limiting on authentication and write endpoints; sane CORS (no `*` with
  credentials); security headers (CSP, HSTS, X-Content-Type-Options).

## 2. Secrets & sensitive data

- **[BLOCKER]** No secrets, tokens, API keys, connection strings, or tunnel credentials
  committed to the repository — not in code, config, compose files, or docs. Secrets come
  from environment/secret manager only; the repo carries `.env.example` with placeholders
  and `.gitignore` must cover `.env*`, key files, and tunnel credential JSON.
- **[BLOCKER]** Passwords stored only as strong adaptive hashes (argon2id or bcrypt with
  adequate cost). Session/refresh tokens stored hashed at rest. JWTs signed with strong
  secrets/keys, short-lived access tokens, HttpOnly+Secure+SameSite cookies if cookies are used.
- PII and private customer data encrypted at rest where the platform supports it, never
  logged in plaintext, and never returned by APIs beyond what the caller's role needs.

## 3. Authorization — least privilege for employees

- **[BLOCKER]** Role-based access control enforced **server-side on every route** —
  hiding buttons in the UI is not authorization. Minimum roles: `admin`, `manager`,
  `employee` (read/limited-write), with employees unable to: delete or bulk-modify
  records, change roles/permissions, access system settings, export full datasets,
  or touch other users' credentials.
- **[BLOCKER]** Destructive operations (delete, bulk update, config change) restricted to
  admin, implemented as soft-delete where feasible, and covered by an immutable audit log
  (who, what, when, before/after).
- Database access follows least privilege too: the app's runtime DB user must not own
  DDL/superuser rights; migrations run with a separate role.

## 4. Architecture, scalability & performance

- Clear layering (routes → validation → services → data access), stateless API processes
  so instances can scale horizontally, connection pooling, pagination on all list
  endpoints (no unbounded `SELECT *`), and indexes on queried columns.
- Response-time budget: p95 < 300ms for standard CRUD under nominal load; long work goes
  to background jobs, not request handlers.
- Health checks, structured logging (without secrets/PII), and graceful shutdown.

## 5. Delivery hygiene

- Work lands via PRs into `main` with passing CI (lint, tests, dependency/secret scan).
- No generated artifacts, `node_modules`, or local state committed.

---

## Intervention protocol

When a violation is detected the monitor will:

1. Flag it on the offending PR/commit as **REQUIRED CHANGES** with the exact rule broken.
2. Provide the concrete fix (commands / code direction).
3. Re-review after the fix lands; the finding is only closed when the rule is verifiably met.

*Monitor log*: last reviewed commit on `main`: `8e044ac` (placeholder repo state, pre-build).
