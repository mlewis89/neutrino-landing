# neutrino.au — Early Access Landing Page

Single-file static landing page for neutrino.au early access email capture.  
Template — reusable for future clients.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page (self-contained HTML + inline CSS + inline JS) |
| `README.md` | This setup and deployment guide |

---

## Setup Checklist (Before Going Live)

### 1. Email Capture — Formspree

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

**Alternative — Mailchimp:**
If the founder has a Mailchimp account, embed an embedded form from the Mailchimp audience dashboard instead. Replace the `<form>` elements with the Mailchimp embed code. Contact Paperclip CTO for implementation.

---

### 2. UTM Tracking

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

### 3. Hosting — GitHub Pages (Recommended, Free)

**Why GitHub Pages:** Free, fast, HTTPS, custom domain support.

Steps:
1. Create a GitHub repository (public or private — Pages works on both).
2. Push `index.html` to the repo root (or `/docs` folder).
3. In GitHub repo → Settings → Pages:
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`), folder: `/root` (or `/docs`)
4. GitHub generates a URL: `https://yourusername.github.io/repo-name`
5. To use `neutrino.au` as the custom domain:
   - Add a `CNAME` file to the repo root containing `neutrino.au`
   - Update DNS at your domain registrar: add a `CNAME` record pointing `www` → `yourusername.github.io`
   - For apex domain (`neutrino.au`): add `A` records pointing to GitHub Pages IPs (see GitHub docs)
   - Enable "Enforce HTTPS" in Pages settings

**Alternative — Vercel (Also Free):**
1. Import repo into [vercel.com](https://vercel.com) (free tier, no credit card needed for static sites).
2. Deploy in ~60 seconds.
3. Add custom domain in Vercel dashboard and update DNS.

---

## Credentials Needed from Founder

| Credential | Purpose | Status |
|------------|---------|--------|
| Formspree account (or email to register one) | Email capture | **NEEDED** |
| GitHub account (or permission to create one) | Hosting | **NEEDED** |
| neutrino.au DNS access | Custom domain | **NEEDED** |

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
