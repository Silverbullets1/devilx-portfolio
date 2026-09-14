# DevilX Security Labs — Official Website

Dark cinematic single-page site for **DevilX Security Labs** — a worldwide studio for web development, process automation and AI WhatsApp / web chatbots.

🌐 Serves clients across **USA · UK · Australia · Worldwide** — enquiries: `bb8654838@gmail.com`

## Live preview

Deploy on Vercel (or any static host): import this repo → Framework **Other / None** → no build command. The root `index.html` is served as-is.

Or preview locally: open `index.html` in a browser, or `python3 -m http.server 8000`.

## What's inside

```
index.html            — page structure + JSON-LD (ProfessionalService, FAQPage)
assets/css/style.css  — full design system (dark monochrome, fluid type scale)
assets/js/site.js     — burger menu, scroll reveals, header state, progress bar,
                        tech marquee, copy-email, mailto enquiry-form builder
assets/fonts/         — Manrope variable + display face (woff2, cached immutably)
assets/img/           — OG image (1200×630) + app icons
favicon.svg           — brand mark
404.html              — branded not-found page
robots.txt / sitemap.xml / site.webmanifest / vercel.json
```

## Design

- **First viewport** — pixel-faithful 1487×1058 cinematic comp: full-bleed looping video plate with measured bottom fade + side letterbox gradients, height-locked unit system (`--u / --uw / --h`), silver-on-#050505 palette, staggered entrance animations, zero purple / glow / cards.
- **Content sections** — editorial service rows, CSS-built capability showcases (chatbot phone, automation flow, browser mock), vertical process timeline, commitments band, why-rows, FAQ accordion, split contact with working mailto form.
- **Mobile** — portrait flow layout, frosted burger + full-screen staggered menu, safe-area padding.
- **A11y & perf** — `prefers-reduced-motion` honoured throughout, skip link, focus-visible rings, ARIA labels, cacheable font/asset headers via `vercel.json`.

## Converting visitors (no fake claims)

Trust is built with **verifiable commitments** — fixed pricing, 24-hour response, NDA/confidentiality, full source & account ownership — not fabricated testimonials. When real client feedback arrives, add it as a strip above `#contact`.

© DevilX Security Labs. All rights reserved.
