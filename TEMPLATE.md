# AI Funnel Machine — Client Template Guide

**Goal:** A new client can have a working email-capture funnel on Vercel in under 1 hour using this template.

---

## What You Get

| Component | File | Reusable? |
|-----------|------|-----------|
| Landing page | `index.html` | Yes — edit copy and colours |
| Form handler | `api/submit.js` | Yes — no changes needed |
| Dependency manifest | `package.json` | Yes — no changes needed |
| Vercel setup guide | `../vercel-setup.md` | Yes — works for any client |

---

## What to Change (per client)

### 1. Brand identity (`index.html`)

Find and replace these values:

| Token | Where | Example |
|-------|-------|---------|
| `neutrino` (brand name) | `<title>`, `.logo`, footer | `acme` |
| `neutrino.au` | footer, meta copy | `acme.com.au` |
| `#5b4aff` (accent colour) | CSS `:root` `--accent` | `#e85d04` |
| `#4035cc` (hover colour) | CSS `:root` `--accent-dark` | `#c44d03` |
| `Early Access — Australia` (nav badge) | `.nav-badge` | `Beta — Australia` |

### 2. Copy (`index.html`)

Update these content blocks:

- **Eyebrow text** (`.eyebrow`): describes the category
- **H1 headline**: primary value proposition
- **Subheadline** (`.subheadline`): supporting context
- **How it works** (`.steps`): 3 steps describing the client's workflow
- **Who it's for** (`.cards`): 2 audience cards
- **CTA section** (`.cta-repeat`): closing hook and form label
- **Footer compliance text**: update client name — compliance language must remain

### 3. Compliance footer

The footer disclaimer **must** be present on every client page. Update only the company name and URL:

```html
<strong>Important:</strong> Outcomes described on this page are illustrative only.
[CLIENT NAME] is a platform that facilitates [describe service]. [CLIENT NAME] does not
guarantee project outcomes, timelines, or costs. Project pricing is variable and quote-based.
All rights reserved under Australian Consumer Law.
```

Do not remove or substantially alter the disclaimer without legal review.

### 4. Google Sheet (Vercel env vars)

Each client gets their own sheet. Set three env vars in the Vercel project:

| Env var | Per client? |
|---------|------------|
| `GOOGLE_CLIENT_EMAIL` | Can reuse same service account across clients |
| `GOOGLE_PRIVATE_KEY` | Can reuse same service account across clients |
| `GOOGLE_SHEET_ID` | **New per client** — each client gets their own sheet |

Follow `../vercel-setup.md` Steps 2 and 4 for each new client.

---

## What Stays the Same

| Component | Why |
|-----------|-----|
| `api/submit.js` | Generic — reads env vars, works for any client |
| `package.json` | No client-specific dependencies |
| UTM capture logic (JS) | Standard across all clients |
| Form submission handler (JS) | Standard across all clients |
| Compliance footer structure | Legal requirement — Australian Consumer Law |
| Google Sheets column schema | Timestamp, Email, UTM × 5, form_location |

---

## Step-by-Step: New Client Setup (~45 minutes)

**Prerequisites:** Vercel account connected to GitHub, Google account for Sheets

1. **Fork the repo** (5 min)
   ```bash
   # Create a new GitHub repo for the client (e.g. acme-landing)
   # Copy landing-page/ contents into it and push to main
   ```

2. **Edit index.html** (15 min)
   - Replace brand name, colours, and all copy sections (see "What to Change" above)
   - Check: headline, subheadline, steps, cards, CTA, footer
   - Do NOT change: form `action="/api/submit"`, UTM hidden inputs, JS handlers

3. **Set up Google Sheet** (5 min)
   - Follow `../vercel-setup.md` Step 2
   - Get the new Sheet ID

4. **Import into Vercel** (5 min)
   - Follow `../vercel-setup.md` Step 1
   - Use the new client GitHub repo

5. **Add env vars** (5 min)
   - Follow `../vercel-setup.md` Step 4
   - Reuse `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` from existing service account
   - Set new `GOOGLE_SHEET_ID`

6. **Test** (5 min)
   - Submit a test email on the Vercel preview URL
   - Confirm it appears in the Google Sheet

7. **Custom domain** (10 min setup, up to 24h DNS propagation)
   - Follow `../vercel-setup.md` Step 6 with the client's domain

---

## Checklist — Before Going Live (any client)

- [ ] All placeholder copy replaced (no "neutrino" references on non-neutrino clients)
- [ ] Accent colour updated to client brand
- [ ] Compliance footer updated with correct client name
- [ ] Test form submission lands in Google Sheet
- [ ] Custom domain configured and HTTPS active
- [ ] Founder/client has reviewed and approved the live copy
- [ ] UTM tracking tested with a test URL (e.g. `?utm_source=test&utm_medium=test`)

---

## Why This Architecture Scales

- **Zero per-client backend cost.** The same Vercel serverless function handles any client — env vars determine where data goes.
- **No new accounts per client.** One Google Cloud service account, one Vercel account, multiple clients.
- **Data isolation.** Each client gets their own Google Sheet. No cross-contamination.
- **Compliance-ready by default.** The footer disclaimer is baked in — an agency cannot accidentally remove it.
- **Handoff-friendly.** The Google Sheet is the deliverable. The client can access it directly without touching code.

---

## Known Constraints

| Constraint | Detail |
|------------|--------|
| Vercel Hobby free tier | 100 serverless invocations/day. Sufficient for early-stage (<100 submits/day). Upgrade to Pro ($20/month) if client exceeds this. |
| Google Sheets API | 300 requests/minute. Not a concern at current volume. |
| Personalisation | No dynamic content on the page — same page for all visitors. Add A/B testing only if client has significant volume. |
| Analytics | UTM capture is built in. For deeper analytics, add a Plausible or Fathom snippet (both have free tiers). |
