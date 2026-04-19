# neutrino.au — Early Access Landing Page

Single-file static landing page for neutrino.au early access email capture.  
Template — reusable for future clients.

---

## Deployment Status

| Component | Status | Detail |
|-----------|--------|--------|
| GitHub repo | ✅ DONE | [github.com/mlewis89/neutrino-landing](https://github.com/mlewis89/neutrino-landing) |
| GitHub Pages | ✅ DONE (building) | https://mlewis89.github.io/neutrino-landing |
| CNAME (for custom domain) | ✅ DONE | `neutrino.au` — one DNS update away |
| Formspree email capture | ⚠️ NEEDED | Founder must complete — see below |
| neutrino.au DNS | ⚠️ NEEDED | Founder must complete — see below |

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page (self-contained HTML + inline CSS + inline JS) |
| `CNAME` | Custom domain config for GitHub Pages |
| `README.md` | This setup and deployment guide |

---

## Outstanding Actions (Founder)

### Action 1 — Formspree email capture (15 minutes)

The form in `index.html` currently has `REPLACE_WITH_YOUR_FORM_ID` as a placeholder.

Steps:
1. Go to [formspree.io](https://formspree.io) and sign up (free, no credit card)
2. Create a new form — name it `neutrino-early-access`
3. Copy the form endpoint (looks like `https://formspree.io/f/xxxxxxxx`)
4. Reply to the CTO Paperclip task with the form ID (the `xxxxxxxx` part)

The CTO will then update `index.html` and push the update to GitHub automatically.

**Account to register with:** Use mlewis89@gmail.com or any email you control.  
**Submissions will be sent to:** Whichever email you register with.

### Action 2 — neutrino.au DNS (10 minutes)

Once you're ready to go live (after founder approval):

Add these DNS records at your domain registrar:
- `A` record: `neutrino.au` → `185.199.108.153`
- `A` record: `neutrino.au` → `185.199.109.153`
- `A` record: `neutrino.au` → `185.199.110.153`
- `A` record: `neutrino.au` → `185.199.111.153`
- `CNAME` record: `www.neutrino.au` → `mlewis89.github.io`

GitHub Pages HTTPS will activate automatically within ~24h of DNS propagation.

---

## Setup Checklist (Technical Reference)

### Email Capture — Formspree

**Why Formspree:** Free tier (50 submissions/month), no backend required, works from static HTML.  
Free tier is sufficient for early access volume.

Steps:
1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form — name it `neutrino-early-access`.
3. Copy the form endpoint (looks like `https://formspree.io/f/xxxxxxxx`).
4. In `index.html`, replace **both** instances of:
   ```
   https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID
   ```
   with the actual endpoint.
5. Submissions will appear in the Formspree dashboard and forward to the registered email.

---

### UTM Tracking

UTM parameters are auto-captured from the URL and included in every form submission.

Supported parameters:
- `utm_source` (e.g. `linkedin`, `reddit`)
- `utm_medium` (e.g. `organic`, `post`)
- `utm_campaign` (e.g. `early-access-launch`)
- `utm_content` (e.g. `headline-a`)
- `utm_term`

Example tracked URL:
```
https://neutrino.au/?utm_source=linkedin&utm_medium=organic&utm_campaign=early-access
```

All UTM values appear as columns in the Formspree submission export.

---

### Hosting — GitHub Pages

**Repo:** https://github.com/mlewis89/neutrino-landing  
**Pages URL:** https://mlewis89.github.io/neutrino-landing (usable for testing)  
**Custom domain:** `neutrino.au` (CNAME file already in repo — DNS update needed from founder)

To push updates:
```bash
cd product/code/landing-page
git add -A && git commit -m "Update landing page" && git push
```

GitHub Pages will redeploy within ~60 seconds of a push.

---

## Credentials

| Credential | Purpose | Status |
|------------|---------|--------|
| Formspree form ID | Email capture | **NEEDED** — founder to sign up and provide |
| neutrino.au DNS access | Custom domain | **NEEDED** — founder to update when ready to go live |
| GitHub account (mlewis89) | Hosting | ✅ Configured |

---

## Reuse for Client #2

To adapt this template for another client:

1. Copy `product/code/landing-page/` to `product/code/landing-page-[client-slug]/`
2. In `index.html`:
   - Replace `neutrino` brand name, color (`--accent: #5b4aff`), and copy
   - Replace Formspree endpoint
   - Update compliance footer if different legal context
3. Takes ~30 minutes per new client.

---

## Copy Summary (for Founder Approval)

**Headline:** "Turn your product idea into reality — guided, all in one place"

**Subheadline:** "Most product ideas never leave the notebook. Neutrino connects you with the designers and makers who can bring yours to life — without the freelancer chaos."

**CTA:** "Get early access"

**Compliance footer (verbatim):**  
> Outcomes described on this page are illustrative only. Neutrino is a platform that facilitates connections between product creators, designers, and makers. Neutrino does not guarantee project outcomes, timelines, or costs. Project pricing is variable and quote-based. All rights reserved under Australian Consumer Law.

No guaranteed outcomes, fixed pricing, or fixed timelines appear anywhere in the copy.
