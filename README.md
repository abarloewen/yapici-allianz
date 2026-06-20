# Allianz Agentur Yapıcı — Website (Design Preview / Dummy)

Premium multipage website for an **Allianz Generalvertretung** (independent Allianz agency), built by **Ummah Collective**. Redesign reference: `vertretung.allianz.de/agentur.yapici`.

> **Status:** Front-end design preview with **dummy data**. No live backend — booking and contact forms are interactive mockups. Replace placeholder agency data before launch.

---

## Advisor

**Ali Yapıcı** — Allianz general agent. Positioning leans on a **dual background**: 12+ years in insurance *and* 10+ years running his own marketing agency across many industries, giving him real understanding of both the on-the-ground and the big-money decisions owners and decision-makers face. His photo (from Xing) is embedded in the home hero and the About page.

## Highlights

- **Allianz-aligned premium design** — Allianz Blue (`#003781`) core, refined spacing, cinematic heroes, gold accent.
- **5 languages with full RTL** — German (default), English, Turkish, Russian, Arabic. Every string translated (269 keys × 5 = 1,345 strings); Arabic switches the whole layout to right-to-left.
- **4 calculators** — Kfz premium estimator, Altersvorsorge (pension-gap), Bedarfs-Check (needs analysis), Risikoleben (life cover sum). Live, instant results.
- **Multi-step booking wizard** — service → channel → date/time → details → confirmation.
- **Advisor photo + dual-expertise section** — Ali Yapıcı portrait with insurance/marketing/owner-perspective story.
- **Berlin imagery throughout** — skyline shots (Unsplash) layered under blue overlays in every page hero, the blue stat/expertise sections, and all CTA bands, plus a subtle skyline along the home hero. Solid-blue fallback if an image fails.
- **8 pages**, fully responsive, mobile-first. Animated pop-up mobile menu containing the nav, phone, email, Instagram + LinkedIn, and a "schedule a meeting" button; socials also in the footer. WhatsApp float, contact form + map + Impressum.
- **Unsplash imagery** embedded with graceful gradient fallback; the agent photo falls back to an "AY" initials avatar if Xing blocks hotlinking.

## Pages

**14 pages.** A "Leistungen" dropdown in the nav links all 8 service detail pages (desktop hover, mobile expanded).

| File | Page |
|---|---|
| `index.html` | Home (Berlin night hero) |
| `leistungen.html` | Services overview (8 lines) |
| `kfz.html` | Kfz-Versicherung detail |
| `haftpflicht.html` | Haftpflicht detail |
| `leben.html` | Leben & Risiko detail |
| `hausrat.html` | Hausrat & Wohnen detail |
| `kranken.html` | Krankenversicherung detail |
| `altersvorsorge.html` | Altersvorsorge detail |
| `rechtsschutz.html` | Rechtsschutz detail |
| `gewerbe.html` | Gewerbe & Firma detail |
| `rechner.html` | Calculator suite (4 calculators) |
| `termin.html` | Booking wizard + how-it-works + direct contact |
| `ueber-uns.html` | About |
| `kontakt.html` | Contact + map + Impressum |

## Structure

```
yapici-allianz/
├── *.html                 (14 pages)
└── assets/
    ├── css/styles.css      design system + RTL
    ├── js/
    │   ├── i18n.js         DE/TR/RU/AR dictionary + agency data
    │   ├── app.js          language engine, nav, reveal, FAQ
    │   ├── calc.js         4 calculators
    │   └── booking.js      booking wizard
    └── img/                logo (light/dark) + favicon (SVG)
```

## Before launch — replace dummy data

All placeholder data lives in **one place**: `assets/js/i18n.js` → `window.AGENCY`.

- Agent name, agency name, address, phone, WhatsApp, email, opening hours — and `photo`.
- **Replace the agent photo with a high-res original** — the current Xing URL is only 256×256 and may block hotlinking (an "AY" initials avatar shows if it fails). Save a high-res photo to `assets/img/` and point `AGENCY.photo` at it.
- Replace the **dummy Instagram + LinkedIn URLs** (`AGENCY.instagram`, `AGENCY.linkedin`) with the real profiles.
- Update the Google Maps embed address in `kontakt.html`.
- Wire booking + contact forms to a real handler (email / CRM / Allianz tooling).
- Confirm Allianz corporate-identity compliance for an official agency site.
- Add real photography (other images are Unsplash placeholders).

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
cd yapici-allianz && python3 -m http.server 8080
```

Switch language via the top-right selector (persists across pages). Add `?lang=ar` to any URL to preview RTL directly.

---

*Built by Ummah Collective Sdn. Bhd. — Intelligence, with integrity.*
