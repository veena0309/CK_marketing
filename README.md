# Credit Kawach — Marketing Site

A standalone static marketing/informational site for Credit Kawach. This is **not** the real
application, there's no backend, no database, and no real login logic. It's a single HTML page
plus CSS and JS, meant to explain the product and collect interest until the real app is live.

## Viewing it locally

You don't need to install anything to look at it, but opening `index.html` directly from disk
will block the contact form (browsers restrict `fetch` from `file://` pages). Serve it with any
simple local server instead:

**Option A — Python (already on most machines):**
```
cd marketing-site
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

**Option B — Node, if you have it:**
```
cd marketing-site
npx serve .
```

**Option C — VS Code:** install the "Live Server" extension, right-click `index.html`, choose
"Open with Live Server."

Once it's running, scroll through top to bottom to review each section in order: Hero, Problem/
Solution, How It Works, Features, Pricing, FAQ, Contact, Footer. Click "Get Started" or "Login" in
the header to see the placeholder modal (both buttons are intentionally not wired to a real
account system yet).

## Contact form

The form on the Contact section posts to [FormSubmit](https://formsubmit.co/), a free
form-to-email service that needs no backend, no signup, and no API key: it just forwards
submissions to `support@creditkawach.com`.

**One-time activation step:** the first time the form is submitted, FormSubmit sends a
confirmation email to `support@creditkawach.com` with an activation link. Someone with access to
that inbox needs to click it once. After that, every future submission is delivered straight to
the inbox automatically. Until it's activated, submissions will still succeed on the frontend but
won't be delivered yet.

## Project structure

```
marketing-site/
  index.html       All page sections
  css/styles.css    Styling, layout, animations
  js/main.js        Scroll reveal, mobile nav, FAQ accordion, modal, contact form
  assets/           (empty, for future images/logo files)
```

## Editing content

Everything is in `index.html`, organized top to bottom in the same order the page renders.
Colors and shared values (navy, teal, spacing, shadows) live as CSS custom properties at the top
of `css/styles.css` under `:root`.
