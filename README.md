# Revon documentation site

Static merchant documentation and public support pages for Revon v1.0.0.

## Contents

- `index.html`: documentation overview
- `getting-started.html`: complete setup and launch sequence
- `presets.html`: Pure, Atelier, and Maison install-state reference
- `customizing.html`: global settings, 39 addable sections, and product blocks
- `cheatsheet.html`: short recipes for common tasks
- `apps.html`: app blocks, embeds, selling plans, and compatibility testing
- `faq.html`: merchant questions based on the current theme implementation
- `changelog.html`: release history
- `support.html`: public contact form and support policy
- `styles.css`: shared documentation design
- `scripts.js`: mobile navigation, scroll behavior, and form enhancements
- `sitemap.xml` and `robots.txt`: crawler configuration

There is no build step. The site uses static HTML, CSS, a small shared JavaScript file,
and externally hosted documentation fonts.

## Source of truth

Update documentation only after checking the current theme files:

- Global controls: `../theme/config/settings_schema.json`
- Preset globals: `../theme/config/settings_data.json`
- Pure templates: `../theme/templates/` and `../theme/sections/*-group.json`
- Atelier install files: `../theme/listings/atelier/`
- Maison install files: `../theme/listings/maison/`
- Addable sections and blocks: each `../theme/sections/*.liquid` schema
- Product blocks: `../theme/sections/main-product.liquid`

Do not document a setting, block, app placement, limit, or behavior unless it exists in
the current schema and rendered code.

## Local preview

The pages can be opened directly in a browser. A local server is optional:

```powershell
cd revon/docs
python -m http.server 4173
```

Then open `http://localhost:4173/`.

## Public deployment

The configured public URL is:

- Documentation: <https://edvardajaweb.github.io/revon-docs/>
- Support: <https://edvardajaweb.github.io/revon-docs/support.html>

The `docs` directory is its own Git repository. Review its status, commit the changed
pages, and push to the branch used by GitHub Pages. Confirm that the public site has
finished deploying before submitting or updating the Theme Store listing.

## Support form

`support.html` posts to Formspree. Before launch:

1. Confirm the Formspree endpoint belongs to the active support account.
2. Enable the required notification and automatic acknowledgement.
3. Confirm attachments work.
4. Submit a real test request.
5. Confirm both the support notification and customer acknowledgement arrive.
6. Keep the stated two-business-day response policy operational.

## Documentation release checklist

1. Validate all local links and fragment identifiers.
2. Check that every page has one `h1`, a unique title, and a meta description.
3. Search for obsolete controls and unsupported claims.
4. Compare preset typography, colors, spacing, and template order with theme JSON.
5. Check desktop and mobile layouts.
6. Test keyboard navigation, focus, mobile drawer, FAQ controls, and support form.
7. Validate HTML and run Lighthouse after deployment.
8. Update `sitemap.xml` dates when publishing material changes.
9. Push the docs repository and verify the public HTTPS URLs.

## Writing rules

- Use merchant-facing labels from the Shopify editor.
- Separate Shopify configuration from Revon configuration.
- Explain consequences before destructive steps.
- Never guarantee compatibility with every app.
- Never publish sample discounts, reviews, results, awards, or delivery claims as facts.
- State that gift wrapping saves cart attributes and does not add a fee.
- State that the shipping progress bar does not create a shipping rate.
- State that theme styles change global settings, not an existing section layout.
- Keep Pure identified as the default preset.
- Keep all three presets at the current 1440px default page width.
