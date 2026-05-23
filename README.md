# SAM-ReJ COMPANY LIMITED Website

Static multipage website for SAM-ReJ COMPANY LIMITED.

The site uses local media only, so Vercel can redeploy without missing photos, videos, posters, or logo files.

## Pages

- `index.html` - homepage
- `about.html` - company background
- `services.html` - service overview
- `portfolio.html` - selected project proof
- `gallery.html` - full photo and video gallery
- `contact.html` - contact details and inquiry form

## Hosted URLs

Vercel is configured with `cleanUrls` in `vercel.json`, so public links use clean paths:

- `/`
- `/about`
- `/services`
- `/portfolio`
- `/gallery`
- `/contact`

The `.html` files stay in the project because this is still a static website, but visitors should not see `.html` in the hosted navigation.

## Media Organization

```
images/
  SAM-Rej COMPANY LIMITED LOGO.webp
  gallery/
    building-*.webp
    site-*.webp
    gate-*.webp
    plan-*.webp
    proof-*.webp
    agriculture-*.webp
    selected plan/site JPEGs where JPG is smaller than WebP
    video-*.mp4
    video-*-poster.webp
```

All files under `images/` are referenced by the live HTML/CSS/JS site. The gallery photos use optimized WebP where it reduces size, and unused old demo/stock images have been removed.

## Contact Form

The contact form submits to FormSubmit through its AJAX endpoint. After a successful response:

- the form fields are reset
- the form content is hidden
- the success popup remains visible

## Local Preview

Open `index.html` directly, or run a local static server:

```bash
py -m http.server 4177 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4177/
```
