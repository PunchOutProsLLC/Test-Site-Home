# Alberti Home Buyers LLC — Landing Page

Premium, conversion-focused marketing site for **Alberti Home Buyers LLC**, a Maryland cash home-buying company.

## Quick start

Open `index.html` in a browser, or serve locally:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## Structure

```
├── index.html              # Full landing page
├── css/styles.css          # Design system + responsive styles
├── js/main.js              # Interactions, form, animations
└── assets/images/
    ├── logo.png            # Brand logo
    ├── hero-home.jpg       # Hero visual
    └── showcase-*.jpg      # Property showcase images
```

## Sections

- Sticky glass navbar with mobile menu
- Hero with cash-offer form
- Social proof + animated stats
- 4-step process
- Property showcase
- Benefits (Alberti Advantage)
- Comparison table
- Testimonials
- Offer packages / pricing
- FAQ accordion
- Final CTA
- Footer + mobile sticky call bar

## Contact

**Phone only:** [443-327-9292](tel:443-327-9292)

## Notes

- Fully responsive, mobile-first, accessible (skip link, focus states, reduced motion)
- Form validates client-side and shows a success state (wire to your CRM/email endpoint for production)
- Brand colors: navy `#0B1F3A`, gold `#C9A227`
