# OSIS E-Voting (Next.js + Tailwind)

A web-based election app for selecting the OSIS chair and vice chair. It uses single-use access tokens instead of importing the entire student roster. The system is optimized for kiosk-style voting booths and a simple admin workflow.

---

## Highlights

- **Token-based access**: 8-character tokens (Crockford Base32) like `9Q4J-M7RP`. Tokens are generated in batches, exported as CSV, and validated server-side. Only token hashes are stored.
- **Ballot flow**: `/token → /ballot → /thanks` with atomic vote casting and a short-lived receipt cookie.
- **Admin**:
  - Login with email/password (Auth.js v5 / NextAuth).
  - CRUD candidate pairs.
  - Generate token batches and download plaintext CSV.
  - Results dashboard with tally and chart, plus CSV export.
- **Security**:
  - Server Actions for all mutations.
  - Rate limiting with Upstash Redis (recommended for production).
  - CSP and common security headers (configurable in `next.config.mjs`).
- **Deploy-ready**: Works well on Vercel and in kiosk setups (ChromeOS Managed Guest Session or Windows Assigned Access).

---

## Tech Stack

- **Next.js** 15.5.4 (App Router, Server Actions)
- **Tailwind CSS** v4
- **Auth.js (NextAuth)** v5 (Credentials provider)
- **Prisma** (PostgreSQL recommended)
- **Upstash Redis + @upstash/ratelimit** (production rate limiting)
- **Recharts** (results chart)

---

## Architecture Overview

```
app/
  login/                     # admin sign-in (Server Action)
  token/                     # token input form → verifies token → sets signed cookie
  ballot/                    # shows candidate pairs → submit vote
  thanks/                    # confirmation

  admin/
    layout.tsx               # admin shell (server)
    page.tsx                 # admin dashboard
    candidates/              # CRUD candidate pairs
      [id]/edit/
    tokens/                  # generate batches, download CSV
    results/                 # tally, chart, export CSV
    settings/                # open/close election (optional)

  api/
    auth/[...nextauth]/      # re-export Auth.js route handlers

lib/
  prisma.ts                  # Prisma client singleton
  crypto.ts                  # token hash/sign/verify utilities
  redis.ts                   # Upstash client
  ratelimitProd.ts           # production rate-limits

prisma/
  schema.prisma              # models: Admin, CandidatePair, Vote, Token, TokenBatch, Election, etc.
```

### Data Model (summary)

- **Admin**: email, passwordHash.
- **CandidatePair**: nomorUrut, ketua, wakil, slug, fotoUrl, visi, misi, aktif.
- **TokenBatch**: metadata of generated token batches.
- **Token**: `tokenHash` (HMAC-SHA256 + pepper), `status` (`unused`/`used`), optional `expiresAt`, `usedAt`, `batchId`.
- **Vote**: `candidatePairId`, timestamp. No voter identity is stored.
- **Election**: `isOpen`, `startAt`, `endAt`, name (optional, used by admin banner/settings).

### Flow (core)

1. **Admin** generates a CSV of 8-char tokens and distributes them to classes/booths.
2. **Voter** goes to `/token`, enters token, passes verification, and receives a signed session cookie.
3. **Ballot** lists active candidate pairs. Voter selects one and submits.
4. **Server Action** atomically marks the token as used and records the vote.
5. **Thanks** page shows a short-lived receipt (cookie) for visual confirmation.
6. **Admin** monitors participation and results, and can export the tally CSV.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL (or a managed Postgres service)
- Optional (production): Upstash Redis account for rate limiting

---

## Getting Started (Development)

```bash
# 1) Install deps
npm install

# 2) Configure environment
cp .env.example .env.local
# then fill values (see Environment Variables below)

# 3) Prisma generate & migrate (dev)
npx prisma generate
npx prisma migrate dev

# 4) Seed (creates admin account and sample data, if provided)
npx prisma db seed   # or npm run db:seed if you have a script

# 5) Run dev server
npm run dev
```

Open http://localhost:3000.

---

## Environment Variables

Create `.env.local` for development and configure the same keys in Vercel for Preview/Production.

```dotenv
# Database
DATABASE_URL=postgres://user:pass@host:port/db

# Auth.js / NextAuth
AUTH_SECRET=your_long_random_string
NEXTAUTH_URL=http://localhost:3000

# Token hashing pepper (HMAC)
TOKEN_PEPPER=another_long_random_string

# Upstash Redis for production rate limiting (optional in dev)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

**Notes**
- `AUTH_SECRET` and `TOKEN_PEPPER` should be long and random. Store them securely.
- In production, set `NEXTAUTH_URL` to your public base URL.

---

## NPM Scripts (typical)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Use `vercel-build` on Vercel to ensure migrations are applied during deployment.

---

## Admin Guide

### Sign in
- Go to `/login`.
- Default admin credentials come from your seed script. Change the password after first login.

### Candidates
- `/admin/candidates` to create, edit, activate/deactivate, or delete pairs.
- Only active pairs appear on the ballot.

### Tokens
- `/admin/tokens` to generate a batch (set optional expiration and note).
- Download the CSV of plaintext tokens as soon as it’s generated; plaintext is not stored in the database.
- Token hashing uses HMAC-SHA256 with `TOKEN_PEPPER`. Only token hashes are stored.

### Results
- `/admin/results` shows participation and tally per candidate pair with a chart.
- Export the tally as CSV from the same page.
- Click **Refresh** to force revalidation if needed during live voting.

### Election window (optional)
- `/admin/settings` to open or close the election window and show a banner across the site.

---

## Voting UX

- `/token`: voters enter their token. On success, a signed session cookie is set and the voter is redirected to `/ballot`.
- `/ballot`: lists active pairs. Submitting the vote triggers a Server Action that atomically marks the token as used and records the vote.
- `/thanks`: confirmation page with a short-lived receipt cookie for the session.

---

## Security Notes

- **Server Actions** handle all sensitive mutations (token verification, vote casting). Forms submit directly to these server functions.
- **Token privacy**: only token hashes are stored. No linkage to student identities.
- **Atomic vote**: marking a token as used and creating a vote happen in a single transaction.
- **Rate limiting**: production rate limits are implemented with Upstash Redis to curb guessing and abuse.
- **Headers / CSP**: `next.config.mjs` sets common security headers and a CSP you can tighten further after testing. Start with Report-Only if you’re iterating.

---

## Kiosk Setup (brief)

- **ChromeOS**: Managed Guest Session or Chrome Kiosk app via Admin Console; auto-launch the site, configure idle behavior.
- **Windows 10/11**: Assigned Access with Microsoft Edge in single-site kiosk mode; set idle timeout to reset the session.

These modes help lock devices to the voting app during the event.

---

## Deployment (Vercel)

1. Push the repository and import it in Vercel.
2. Set environment variables for Production and Preview.
3. Ensure `vercel-build` runs migrations: `prisma migrate deploy`.
4. After deployment, test:
   - Admin sign-in
   - Candidate CRUD
   - Generate tokens and download CSV
   - Full voting flow
   - Results page and CSV export

---

## Troubleshooting

- **“Token invalid/used/expired” after submitting the ballot**  
  Confirm you are posting from the same origin/host as where the token was verified. Check cookies and host consistency on the device.

- **Auth fails with `MissingSecret`**  
  Set `AUTH_SECRET` and `NEXTAUTH_URL` in the environment.

- **Prisma errors in production**  
  Ensure the database is reachable and migrations are deployed (`prisma migrate deploy`).

- **CSP blocks resources**  
  Start with Report-Only, then add allowed sources to the relevant directives. Tighten once no violations appear.

---

## Notes for Reviewers

- The codebase uses App Router conventions:
  - Use `<form action={serverAction}>` rather than custom fetch for core flows.
  - Avoid passing inline functions as `action` in Server Components.
- Keep admin routes protected. Combine `middleware` auth checks with server-side checks when necessary.

---

## Roadmap Ideas (optional)

- QR code token input.
- Multi-election support and archival.
- Real-time participation board.
- Admin activity logs and audit trail.

---

This README should be enough to set up, operate, and deploy the application safely. If your environment or policies require additional controls, add them where indicated (CSP tightening, cookie domain/secure settings, kiosk restrictions).
