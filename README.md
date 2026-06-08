# samgreenalaska.github.io

Personal career website for Sam Green, Senior Installation Engineer. A fast, static,
multipage site aimed at Alaska oil and gas recruiters and hiring managers.

Live at: https://samgreenalaska.github.io

## Stack

Plain static HTML, CSS, and a little vanilla JavaScript. No frameworks, no build step.
Hosted on GitHub Pages, served from the repository root.

## Structure

```
index.html         Home: hero, credibility snapshot, "why Alaska" pitch
experience.html    Career timeline (TechnipFMC, Hilcorp) and education
projects.html      De-identified subsea campaigns (cards + full table)
capabilities.html  Scope-by-scope capabilities with photos, plus skills
contact.html       Email, phone, LinkedIn, location, resume download
css/style.css      All styling (design tokens at the top)
js/nav.js          Mobile navigation toggle
js/interview.js    "Request an interview" modal (submits to Web3Forms)
assets/resume.pdf  Public resume (downloads as "Sam Green - Resume.pdf")
photos/            Site images (compressed JPEGs)
```

## Preview locally

From this folder:

```
npx -y serve . -l 8123
```

Then open http://localhost:8123

## Publish changes

```
git add .
git commit -m "describe what changed"
git push
```

GitHub Pages rebuilds automatically in a minute or two.

## Contact form

The interview modal posts to Web3Forms (a serverless form backend that works on static
hosting). The access key is in `js/interview.js`. Submissions are emailed to the address
tied to that key.

## Photo confidentiality

Site photos are scrubbed stills from subsea operations. The raw originals contained
burned-in location coordinates, dates, and field-code captions and must never be
published; they are kept out of this folder. Only owner-approved, de-identified images
live in `photos/`. Before adding any new photo, confirm it shows no coordinates
(easting/northing readouts), dive dates, or field-code captions.

## Source content

Site copy is drawn from the resume and project records. Client, vessel, field, and well
identifiers are deliberately withheld; scope and asset type carry the story instead.
