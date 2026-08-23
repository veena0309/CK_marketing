# Credit Kawach — Marketing Site

A standalone static marketing/informational site for Credit Kawach. This is **not** the real
application, there's no backend, no database, and no real login logic. It's a single HTML page
plus CSS and JS, meant to explain the product and collect interest until the real app is live.

## Viewing it locally

The static pages (everything except the contact form's send step) can be viewed with any simple
local server, e.g. `python -m http.server 5500` from this folder, then open
`http://localhost:5500`. Opening `index.html` directly from disk works for browsing but the
contact form won't be able to reach `/api/contact` (that route only exists when served by Vercel
or `vercel dev`, see below).

Scroll through top to bottom to review each section in order: Hero, Problem/Solution, How It
Works, Features, Pricing, Contact, FAQ, Footer. Click "Get Started" or "Login" in the header to
see the placeholder modal (both buttons are intentionally not wired to a real account system yet).

## Contact form

The form posts to `/api/contact`, a Vercel serverless function ([api/contact.js](api/contact.js))
that calls [Postmark](https://postmarkapp.com/)'s API server-side to send the message to
`support@creditkawach.com`. The Postmark Server API token lives only in the `POSTMARK_SERVER_TOKEN`
environment variable, set in the Vercel project's settings (or a local `.env` file for `vercel
dev`), never in frontend code and never committed to this repo.

**The `From` address matters.** The function sends `From: support@creditkawach.com`. Postmark
rejects sends from any address that isn't a verified Sender Signature (or on a verified domain) in
your Postmark account. If `support@creditkawach.com` isn't already verified there, either verify it
or change the `From` in `api/contact.js` to an address that is.

**Testing it:**
1. Push this repo to GitHub (already done), then import it into Vercel ([vercel.com/new](https://vercel.com/new)) as a new project. Vercel auto-detects the static site plus the `api/` function, no build config needed.
2. In the Vercel project's Settings → Environment Variables, add `POSTMARK_SERVER_TOKEN` with your Postmark Server API token as the value.
3. Deploy. Visit the resulting `*.vercel.app` URL, scroll to Contact, and submit the form with a real email address.
4. Check the `support@creditkawach.com` inbox for the message, and check the visitor's inbox got nothing (the function doesn't email the visitor, it just sets `ReplyTo` so you can reply directly).
5. If it fails, check the function's logs in the Vercel dashboard (Deployments → the deployment → Functions → `api/contact`), Postmark's API returns a clear error message (most likely cause: unverified `From` address, see above).

If you have Node.js and the Vercel CLI installed locally, `vercel dev` in this folder serves the
static site and the API function together on one local port, so you can test the whole flow
without deploying first.

## Project structure

```
marketing-site/
  index.html        All page sections
  css/styles.css     Styling, layout, animations
  js/main.js         Scroll reveal, mobile nav, FAQ accordion, modal, contact form
  api/contact.js     Serverless function: receives the form POST, calls Postmark
  assets/            Logo files
  package.json       Marks this as a Node project for Vercel (no dependencies needed)
  .env.example       Documents the POSTMARK_SERVER_TOKEN env var (no real value)
```

## Editing content

Everything is in `index.html`, organized top to bottom in the same order the page renders.
Colors and shared values (navy, teal, spacing, shadows) live as CSS custom properties at the top
of `css/styles.css` under `:root`.
