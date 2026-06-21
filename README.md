# The SpringHouse Church — Frontend

**Church:** The SpringHouse Church, Calabar, Nigeria  
**Pastor:** Dr Austin Mboso  
**Tagline:** Across the street, across the seas!  
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS

---

## Project Structure

```
springhouse-church/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, Navbar, Footer
│   ├── globals.css         # Global styles + CSS variables
│   ├── page.tsx            # Home page
│   ├── about/              # About page
│   ├── sermons/            # Sermons archive + /[slug] detail
│   ├── ministries/         # Ministries listing + /[slug] detail
│   ├── events/             # Events calendar + /[slug] detail
│   ├── blog/               # Blog archive + /[slug] article
│   ├── contact/            # Contact & prayer page
│   └── give/               # Giving page
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── SermonCard.tsx
│   ├── EventCard.tsx
│   ├── BlogCard.tsx
│   ├── MinistryCard.tsx
│   ├── PrayerForm.tsx
│   ├── GiveButton.tsx
│   ├── LiveStreamBanner.tsx
│   └── index.ts            # Barrel export
├── lib/
│   ├── api.ts              # Fetch wrapper pointing to NEXT_PUBLIC_API_URL
│   └── types.ts            # TypeScript interfaces for all data models
├── tailwind.config.ts      # Custom design tokens
└── .env.local.example      # Environment variable template
```

---

## Setup

```bash
# 1. Install dependencies
npm installbs

# 2. Copy env file and fill in values
cp .env.local.example .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Django REST Framework base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | `https://springhousechurch.org` |
| `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` | YouTube channel ID for live stream | *(from YouTube Studio)* |

---

## Design Tokens

| Token | Hex | Usage |
|---|---|---|
| `brand-blue` | `#1A3A6B` | Nav, headings, footer background |
| `brand-red` | `#C0272D` | CTA buttons, active states |
| `brand-gold` | `#D4A017` | Dividers, scripture, decorative accents |
| `brand-cream` | `#FAF8F4` | Page background, cards |

**Fonts:** Cormorant Garamond (display/headings) · DM Sans (body text)

---

## Backend

The Django REST Framework backend lives in a separate repo (`springhouse_api`).  
All API calls in this frontend use the `NEXT_PUBLIC_API_URL` env variable via `lib/api.ts`.
