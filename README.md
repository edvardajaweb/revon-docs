# Revon — Theme documentation site

Static HTML docs site + public contact form for the Revon Shopify theme, built to satisfy
[Shopify Theme Store Rule 21](https://shopify.dev/docs/storefronts/themes/store/requirements#documentation-and-contact-forms):

> You must provide theme documentation and a public support contact form. You must link your
> documentation and contact form to your theme listing page.

## What's in this folder

```
Revon-docs/
├── index.html          landing page
├── getting-started.html install guide
├── customizing.html    sections, blocks, theme settings overview
├── faq.html            frequently asked questions
├── support.html        contact form + support policy
├── styles.css          shared styles (pure CSS, no build step)
└── README.md           this file
```

No JavaScript, no build step, no dependencies. Drop it on any static host.

## Before publishing — you MUST do these two things

### 1. Wire up the contact form

The form on [support.html](support.html) is currently pointing at a placeholder
Formspree URL (`https://formspree.io/f/YOUR_FORM_ID`). You need a real form backend.

**Recommended: Formspree free tier**

1. Sign up at <https://formspree.io/> (free tier allows 50 submissions / month)
2. Click **New form**, pick a name, click **Create form**
3. Copy the endpoint — it looks like `https://formspree.io/f/abc123xyz`
4. Open `support.html`, find `YOUR_FORM_ID`, replace the whole URL with yours
5. In the Formspree dashboard for this form:
   - Enable **Auto-response** (required by Rule 21) — write a short message confirming
     you received the request and that you reply within two business days
   - Enable **File uploads** (Rule 21 requires allowing screenshot attachments)
   - Set **Notifications** to the email you actually check
   - Optionally add **reCAPTCHA** for spam

**Alternatives** (all free, all work with the existing HTML):
- [Web3Forms](https://web3forms.com/) — unlimited submissions, no account required
- [Formsubmit.co](https://formsubmit.co/) — no signup, add `https://formsubmit.co/your@email.com` as the action
- [Tally](https://tally.so/) — nicer UI but requires building the form in their editor
- [Netlify Forms](https://docs.netlify.com/forms/setup/) — free if you deploy via Netlify

### 2. Update the Shopify theme `theme_info` URLs

Once the docs site is live, open the Revon theme repo and edit
`config/settings_schema.json`. Find the `theme_info` block at the top:

```json
{
  "name": "theme_info",
  "theme_name": "Revon",
  "theme_version": "1.0.0",
  "theme_author": "Edvardaja Studio",
  "theme_documentation_url": "https://help.shopify.com/en/manual/online-store/themes",
  "theme_support_url": "https://help.shopify.com/en/manual/online-store/themes"
}
```

Replace both URLs with your live docs site:

```json
  "theme_documentation_url": "https://your-docs-site.com/index.html",
  "theme_support_url": "https://your-docs-site.com/support.html"
```

These URLs are also what you paste into the Theme Store submission form when listing
your theme. They MUST be live and public before you submit.

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

- [ ] Replaced `YOUR_FORM_ID` in `support.html` with a real Formspree (or alternative) endpoint
- [ ] Enabled auto-responder in the form backend
- [ ] Enabled file uploads in the form backend
- [ ] Tested the form end-to-end — submitted a test message and received both the notification and the auto-response
- [ ] Deployed to a public URL
- [ ] Tested every page loads over HTTPS (theme store requires this)
- [ ] Ran Lighthouse — Performance and Accessibility both ≥ 95
- [ ] Updated `theme_documentation_url` and `theme_support_url` in the theme's `config/settings_schema.json`
- [ ] Walked through each page as a merchant who's never seen Revon — is anything confusing?
- [ ] Pasted the docs URL and support URL into your Theme Store submission form
