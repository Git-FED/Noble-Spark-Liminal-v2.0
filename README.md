# Unlocked Browser

A local-first static project site for an authorization-first browser-testing toolkit.

![Unlocked Browser homepage](assets/readme/homepage.jpg)

> Curious by nature. Careful by design.

This repository contains the public-facing HTML/CSS/JavaScript site for **Unlocked Browser** and its surrounding FED-OS ecosystem. It is deliberately simple to deploy: no build step, database, framework, or server runtime is required.

## See it work

**Live demo:** no hosted demo URL has been configured in this bundle. The site is ready for GitHub Pages or Cloudflare Pages, but deployment still needs to be enabled in the repository/project settings.

**Run the real site locally:**

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/) and explore the actual landing page, animated background, community page, payment age gate, login page, and static destinations.

![Short real-site demo](assets/readme/demo.gif)

The Python browser toolkit itself lives in the linked implementation repository. Its quickest documented path is:

```bash
pip install -r requirements.txt
python -m playwright install chromium
python cli.py open https://example.com --text
```

[Open the Noble Spark Browser Python repository →](https://github.com/Git-FED/Noble-Spark-Browser-Python)

For a focused animation test, open [`demo/index.html`](demo/index.html). It is the real Nocturne Flow preview page, not a mockup.

## Why this exists

Browser-testing projects often make the first impression harder than the first run. Important scope guidance is separated from the useful commands, payment and community destinations are scattered across unrelated links, and a static landing page can feel like a dead end even when the underlying tool is practical.

This bundle makes the public layer easier to understand and easier to deploy. It gives visitors a clear route from the project story to the working Python repository, while keeping responsible-use guidance, community access, payment age gates, and provider links visible.

The project is intentionally different in a few ways:

- **Permission is part of the product.** The site makes authorization, scope, stop conditions, and polite test rates first-class content.
- **Static by default.** The public site is plain HTML, CSS, JavaScript, SVG, WebP, and GIF. It can be published without a build pipeline.
- **Useful motion, not visual noise.** The site uses procedural contour animation, a looping ticker, reveal transitions, hover states, and a real animated GIF—without orbital paths, planets, rings, or starfields.
- **Provider boundaries stay visible.** Payment pages are advisory age-gated before provider widgets load. Checkout, billing, and provider terms remain with the named provider.

## Screenshots

### Landing page and quick start

The homepage connects the project message to the verified repository commands, real destinations, animated signal art, and responsible-use guidance.

![Homepage showing the launch console, command panel, and dark visual system](assets/readme/homepage.jpg)

### Nocturne Flow demo

The demo page isolates the procedural canvas background and its reduced-motion-aware pause control.

![Nocturne Flow demo page showing dark teal and violet contour motion](assets/readme/nocturne-flow-demo.jpg)

### Age-gated payment route

Payment options are hidden until the visitor passes the session-only 18+ self-attestation flow. This is an advisory front-end gate, not identity verification or legal-age verification.

![Donation page showing the advisory payment age gate](assets/readme/payment-age-gate.jpg)

### Community route

The Discord widget is centered in a responsive frame, with a local HTML route to the server list and newsletter flow.

![Community page showing the centered Discord panel and community content](assets/readme/community-page.jpg)

## Quick start

### Preview the static site

```bash
cd unlocked-browser-dark-background
python3 -m http.server 8000
```

Then open [http://localhost:8000/](http://localhost:8000/). A local HTTP server is recommended over opening files directly because third-party widgets and browser security features work more reliably over `http://localhost`.

### Run the browser toolkit

The static site points to the implementation repository. From that repository:

```bash
pip install -r requirements.txt
python -m playwright install chromium
python cli.py open https://example.com --text
```

Use only URLs you own or have explicit permission to assess. The public site does not claim that the browser toolkit defeats CAPTCHAs, access controls, rate limits, bot protections, or account security.

## What is included

```text
unlocked-browser-dark-background/
├── index.html                    # project landing page
├── demo/index.html               # real Nocturne Flow animation preview
├── community-invite.html         # centered Discord widget and newsletter route
├── support.html                  # support choices
├── subscriptions.html            # age-gated recurring support
├── donations.html                # age-gated one-time support
├── private-communities.html      # 18+ and country gate for private Matrix access
├── login.html                    # supplied Supabase sign-in/sign-up UI
├── fedpromptly-invite.html       # animated FedPromptly/Discord-style invite card
├── responsible-use.html          # authorization and safety guidance
├── privacy.html                  # privacy notes
├── terms.html                    # terms and scope
├── 404.html                      # static-hosting not-found page
├── _headers                      # Cloudflare Pages response headers
├── .nojekyll                     # GitHub Pages static publishing marker
├── DEPLOYMENT.md                 # GitHub Pages and Cloudflare Pages notes
├── assets/
│   ├── favicon.svg               # abstract symbol favicon; not a letter
│   ├── brand-mark.svg
│   ├── site.css / site.js
│   ├── flow-background.css / flow-background.js
│   ├── payment-gate.js
│   ├── discord-servers.css / discord-servers.js
│   ├── art/                      # comic illustrations, banners, WebP, and GIF assets
│   └── readme/                   # real README screenshots and demo GIF
├── docs/ANTI-BLOCK.md
└── tools/create_signal_loop.py
```

## Visual system

The site uses a near-black ink field with teal, violet, and restrained amber accents. Its motion system includes:

- a procedural Canvas background with open, flowing contour ribbons;
- a seamless `signal-loop.gif` plus a static still for reduced-motion visitors;
- an infinitely looping ticker strip;
- reveal-on-scroll and hover transitions;
- an animated FED-OS footer scanline;
- original comic-style promotional banners and cards;
- a symbol-based SVG favicon and brand marks.

The visual direction is intentionally **non-orbital**: there are no planets, rings, orbit lines, or starfields.

## Deployment

This is a static site root.

### GitHub Pages

Publish the repository root, or publish this folder as the Pages artifact. Keep `assets/` beside the HTML files. `.nojekyll` asks GitHub Pages to publish the files unchanged, and `404.html` supplies the static not-found route.

### Cloudflare Pages

Use this folder as the output directory with no build command. `_headers` supplies basic response headers. A Worker runtime is not required for the current site.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the full deployment checklist and provider configuration notes.

## Important boundaries

- Payment pages use a session-only, self-attested 18+ gate before provider widgets load.
- Private Matrix access is not exposed in the public footer; it is behind `private-communities.html`, which asks for age confirmation and an allowed-country selection.
- Supabase publishable configuration appears in the supplied frontend login page. Keep private service-role keys out of static frontend files.
- `fedpromptly-invite.html` is the full animated FedPromptly invite destination; the compact header link sits beside Login and leads to this real HTML page.
- Community and payment embeds require network access and may not work from a direct `file://` open.
- Read [`responsible-use.html`](responsible-use.html) and [`docs/ANTI-BLOCK.md`](docs/ANTI-BLOCK.md) before using browser-automation code.

## License and project status

No license file or package-release metadata is included in this static-site bundle, so no license badge or package version is claimed here. The site is a deployable static artifact; the browser-automation implementation is maintained in the linked [Noble Spark Browser Python repository](https://github.com/Git-FED/Noble-Spark-Browser-Python).
