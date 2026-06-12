# Gitcook

Browse GitHub trending repositories and get ideas for useful tools you could build — plus extras worth adding.

Open source: [github.com/bkrupam/gitcook](https://github.com/bkrupam/gitcook)

## Features

- Browse GitHub Trending with language and time-range filters
- Search repos by name, author, description, or language
- Generate a practical tool idea from any trending repo
- Mix two repos into one tool concept with extra utility from both
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
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GITHUB_TOKEN=optional_github_token_for_higher_rate_limits
```

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
