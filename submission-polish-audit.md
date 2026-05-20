# Revon Submission Polish Audit

Last checked: 2026-05-20

## Default preset

Status: Pure is the default preset.

Checked areas:

- `theme/config/settings_data.json`
- `theme/README.md`
- `docs/index.html`
- `docs/getting-started.html`
- `docs/presets.html`
- `docs/faq.html`, including FAQ JSON-LD
- `docs/changelog.html`

## Claim and promo copy

Status: default install copy has been neutralized.

Changed before submission:

- Removed the default "10% off" newsletter promise.
- Removed invented clinical percentage claims from the default homepage.
- Removed default review totals such as "12,400+ reviews".
- Removed "Verified buyer" roles from default template testimonials.
- Replaced hardcoded shipping and return promises with editable policy placeholders.
- Replaced product-page clinical/material claims with merchant-editable placeholder copy.

Allowed functional references that remain:

- Discount display and discount-code support, because these describe theme functionality.
- Free-shipping progress bar settings, because merchants control whether they enable and configure this offer.
- Example docs that tell merchants to use sourced proof points, because they are guidance rather than storefront claims.

## Demo image license audit

Status: source ledger is present, but final demo-store visual inspection is still required.

Local source ledgers:

- `scripts/product-images.json`: 38 product image sources.
- `scripts/section-images.json`: 30 section/lifestyle image sources.
- Current audit result: all 68 listed demo image sources are `images.unsplash.com` URLs.
- Current theme-folder media audit: no local `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.mp4`, `.webm`, or `.mov` files are included in `theme/`.

License notes:

- Unsplash says images can be used for commercial and non-commercial purposes without permission or attribution: https://unsplash.com/license
- Unsplash terms also warn that the image license does not grant rights to visible trademarks, recognizable people, or copyrighted works of art: https://unsplash.com/terms
- Unsplash has a specific help note on visible logos/brands and possible extra permissions: https://help.unsplash.com/en/articles/14224409-what-if-there-is-a-brand-logo-in-an-image-on-unsplash

Final manual check before submission:

- Open the public demo store and inspect every visible demo image.
- Replace any image with clear logos, branded products, recognizable people used as endorsement, artwork, or anything that looks like a real third-party product listing.
- Keep screenshots or a small source spreadsheet for the exact final demo images used in the published demo store.

## Theme listing copy draft

Short description:

Revon is an editorial Shopify theme for beauty, fashion, and home brands that need polished storytelling, flexible product discovery, and conversion-ready commerce tools.

Long description:

Revon gives merchants three complete visual directions in one theme: Pure for beauty and wellness, Atelier for fashion and accessories, and Maison for home and lifestyle. Each preset is designed around strong first impressions, rich product storytelling, and practical shopping flows. Use cinematic heroes, proof-point sections, before-and-after layouts, lookbooks, room plans, featured products, testimonials, editorial pages, and flexible product media to build a storefront that feels considered from homepage to checkout.

Feature bullets:

- Three industry-ready presets: Pure, Atelier, and Maison.
- Collection and search filtering, sorting, pagination, and quick product discovery.
- Product pages with media galleries, variant states, pickup availability, selling plans, dynamic checkout, complementary sections, and recently viewed products.
- Storytelling sections for lookbooks, shop-the-look, before-and-after, ingredient or material notes, testimonials, FAQs, video, and editorial content.
- Cart drawer and cart page support with discounts, shipping progress, notes, accelerated checkout, and payment icons.
- Built for Online Store 2.0 with app blocks, custom Liquid, localization selectors, and four storefront languages.

Tone rules for listing copy:

- Do not mention fake metrics, review counts, sales, revenue, or conversion promises.
- Do not promise discounts, free shipping, or returns unless the demo store actually provides them.
- Keep feature claims tied to theme functionality, not merchant business outcomes.

## Listing screenshots

Status: not ready until captured from the final public demo store.

Required next step:

- Capture the Theme Store listing card screenshot at `1600 x 1000px`.
- Capture supporting screenshots from the final demo after the storefront password is off.
- Use real demo pages: homepage, product page, collection/search, cart, and one editorial/preset page.

Shopify notes:

- Shopify lists incomplete or missing screenshots as a common rejection reason: https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections
- Shopify requires documentation and a contact form to be linked from the listing: https://shopify.dev/docs/storefronts/themes/store/requirements
