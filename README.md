# Portfolio

Personal portfolio site built with React, TypeScript, and Vite. Features a cinematic liquid-blob UI, bilingual EN/FR content, EmailJS contact form, and Umami analytics.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **EmailJS** — contact form, no backend needed
- **Umami** — privacy-friendly analytics (add after deploying)

## Project structure

```
src/
├── data/
│   ├── projects.ts   ← add/edit projects here
│   └── skills.ts     ← add/edit skills here
├── i18n/
│   ├── en.json       ← English strings
│   ├── fr.json       ← French strings
│   └── index.ts
├── App.tsx
└── index.css
```

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env` file at the root (never commit this):

```env
# EmailJS — https://emailjs.com
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=

# Umami — https://cloud.umami.is (fill in after deploying)
VITE_UMAMI_WEBSITE_ID=
```

### EmailJS setup

1. Create an account at [emailjs.com](https://emailjs.com)
2. **Email Services** → connect Gmail → copy the Service ID
3. **Email Templates** → create a template with variables `{{from_name}}`, `{{from_email}}`, `{{message}}` → copy the Template ID
4. **Account** → **Public Key** → copy it

### Umami setup

1. Deploy the site first
2. Create an account at [cloud.umami.is](https://cloud.umami.is)
3. Add your site URL → go to **Tracking Code** → copy the `data-website-id` value

## Adding a project

Open `src/data/projects.ts` and append an entry to the array:

```ts
{
  name: 'My New Project',
  tags: ['React', 'Node.js'],
  en: 'Description in English.',
  fr: 'Description en français.',
  link: 'https://github.com/yannuser/my-new-project',
  linkLabel: 'view', // or 'live' for deployed sites
},
```

## Adding a skill

Open `src/data/skills.ts` and add to the relevant array (`langs`, `libs`, or `tools`).

## Build

```bash
npm run build
```
