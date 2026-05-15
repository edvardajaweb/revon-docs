# Revon — Theme documentation site

Static HTML docs site + public contact form for the Revon Shopify theme, built to satisfy
[Shopify Theme Store Rule 21](https://shopify.dev/docs/storefronts/themes/store/requirements#documentation-and-contact-forms):

> You must provide theme documentation and a public support contact form. You must link your
> documentation and contact form to your theme listing page.

## What's in this folder

```
docs/
├── index.html             landing page
├── getting-started.html   install + setup guide
├── presets.html           Pure / Atelier / Maison preset reference
├── customizing.html       Section catalog, blocks, theme settings
├── faq.html               frequently asked questions
├── changelog.html         version history
├── support.html           contact form + support policy
├── styles.css             shared styles
├── scripts.js             small client-side behaviors (mobile drawer, scroll-spy, form handling)
└── README.md              this file
```

Minimal JavaScript (~5 KB, all in `scripts.js`), no build step, no dependencies. Drop it on any static host.

## Before publishing — you MUST do these two things

### 1. Wire up the contact form ✅ done

The form on [support.html](support.html) is wired to Formspree
(`https://formspree.io/f/xjgljokn`). To finish setup, log in to the Formspree dashboard
for this form and:

- Enable **Auto-response** (required by Theme Store Rule 21) — write a short message
  confirming you received the request and that you reply within two business days
- Enable **File uploads** (Rule 21 requires allowing screenshot attachments)
- Set **Notifications** to the email address you actually check (where you want support requests delivered)
- Optionally add **reCAPTCHA** for spam

The first form submission also acts as the activation step — submit one test message
after deploying to confirm the endpoint is live.

**If you switch backends**, supported alternatives are:
- [Web3Forms](https://web3forms.com/) — unlimited submissions, no account required
- [Formsubmit.co](https://formsubmit.co/) — no signup, add `https://formsubmit.co/your@email.com` as the action
- [Tally](https://tally.so/) — nicer UI but requires building the form in their editor
- [Netlify Forms](https://docs.netlify.com/forms/setup/) — free if you deploy via Netlify

### 2. Update the Shopify theme `theme_info` URLs ✅ done

The `theme_info` block in `theme/config/settings_schema.json` already points at this
docs site:

```json
{
  "name": "theme_info",
  "theme_name": "Revon",
  "theme_version": "1.0.0",
  "theme_author": "Edvardaja Studio",
  "theme_documentation_url": "https://edvardajaweb.github.io/revon-docs/",
  "theme_support_url": "https://edvardajaweb.github.io/revon-docs/support.html"
}
```

Paste the same URLs into the Theme Store submission form when listing the theme.

## Deployment options (ranked by ease)

### Option A — GitHub Pages (free, 5 min)

1. Create a new GitHub repo called `revon-docs` (or any name)
2. Push the contents of this folder to the repo
3. In the repo settings, go to **Pages**, set source to `main` branch, root folder
4. GitHub gives you a URL like `https://yourusername.github.io/revon-docs/`
5. Your docs are live

```bash
cd /Users/dominykajakialyte/Desktop/Revon-docs
git init
git add .
git commit -m "Initial Revon docs site"
# create the empty repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/revon-docs.git
git branch -M main
git push -u origin main
```

**Custom domain:** optional — buy a domain, add a `CNAME` file, update DNS. See
[GitHub's docs on custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

### Option B — Netlify (free, 2 min, auto-deploys on git push)

1. Sign up at <https://netlify.com/>
2. Drag the `Revon-docs` folder onto their dashboard
3. They give you a URL like `https://sparkly-taco-123.netlify.app/`
4. Done. You can also connect a GitHub repo for auto-deploys and add a custom domain.

Netlify also has native [form handling](https://docs.netlify.com/forms/setup/) as an
alternative to Formspree — add `netlify` as an attribute to the `<form>` tag and they
catch submissions automatically.

### Option C — Vercel (free, similar to Netlify)

Same flow as Netlify. Sign up, import the folder, deploy.

### Option D — Your own hosting

Upload the files via FTP/SFTP to any web server. Point a subdomain like
`docs.yourstudio.com` at it.

## Customization

This site intentionally has no branding beyond the word "Revon" so it feels consistent
with the theme. If you want to match your studio's brand:

- **Colors**: edit the `:root` variables at the top of `styles.css`
- **Fonts**: change `--font-sans` and `--font-serif`
- **Logo**: replace the text `Revon` in each file's `.site-header__brand` with an `<img>` tag
- **Favicon**: add `<link rel="icon" href="favicon.ico">` to each `<head>` and drop a favicon in the folder

Avoid adding heavy CSS frameworks or JavaScript — Rule 21 just needs the site to be
accessible and functional, not fancy.

## Accessibility & performance

The site is already:
- Keyboard navigable (skip-to-content link, visible focus rings)
- WCAG 2.1 AA contrast compliant
- Mobile responsive (breakpoint at 600px)
- Zero-JavaScript (loads instantly)
- Screen-reader friendly (semantic HTML, proper heading hierarchy, labeled form inputs)

Run it through [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) after
deploy to confirm — you should see 100 / 100 on Performance and Accessibility without any
tuning.

## License

These docs are part of your Revon theme deliverable. Edit them freely to match your
studio's voice — they don't need to be literal copies of what's here.

## Checklist before you submit to the Theme Store

- [x] ~~Replaced `YOUR_FORM_ID` in `support.html` with a real Formspree endpoint~~ — done (`xjgljokn`).
- [ ] Enabled auto-responder in the Formspree dashboard
- [ ] Enabled file uploads in the Formspree dashboard
- [ ] Tested the form end-to-end — submitted a test message and received both the notification and the auto-response
- [x] ~~Deployed to a public URL~~ — live at <https://edvardajaweb.github.io/revon-docs/>
- [ ] Re-deployed after the latest docs rewrite (presets.html added, customizing/getting-started/faq/changelog rewritten — push `docs/` to its remote)
- [ ] Tested every page loads over HTTPS
- [ ] Ran Lighthouse — Performance and Accessibility both ≥ 95
- [x] ~~Updated `theme_documentation_url` and `theme_support_url` in the theme's `config/settings_schema.json`~~ — done.
- [ ] Walked through each page as a merchant who's never seen Revon — is anything confusing?
- [ ] Pasted the docs URL and support URL into the Theme Store submission form
