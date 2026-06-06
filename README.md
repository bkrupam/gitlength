# Gitlength

Turn GitHub trending repositories into micro-SaaS ideas powered by Groq.

## Features

- Browse GitHub Trending with language and time-range filters
- Search repos by name, author, description, or language
- Generate a micro-SaaS idea from any trending repo
- Combine two repos into a hybrid product concept
- Regenerate ideas and copy results as Markdown

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and add your Groq API key:

```bash
cp .env.local.example .env.local
```

Set:

```env
USE_MOCK_IDEAS=true
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GITHUB_TOKEN=optional_github_token_for_higher_rate_limits
```

Set `USE_MOCK_IDEAS=false` when you want real Groq-generated ideas.

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

- `GET /api/trending?language=&since=daily|weekly|monthly`
- `POST /api/idea` with `{ repo }`
- `POST /api/combine` with `{ repoA, repoB }`

## Design System

UI follows the cord.com design system defined in `DESIGN (1).md`. Tokens are wired in `app/globals.css` and enforced via `.cursor/rules/design-system.mdc`.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS v4
- Groq SDK
- Cheerio (GitHub Trending scraper)
