# Sacred Spaces, Safe Homes: Feasibility & Visioning Copilot

Prototype for Track 3.1. A church leader enters their lot and the zoning text that applies, and gets:

- a live site sketch and rough unit estimate
- a plain-language feasibility read from Claude, where a rule gets a section number only if that section is in the pasted zoning text (everything else is marked "Unverified")
- obstacles with mission-driven counterpoints, a preliminary financing sketch, and questions for experts
- slides, a one-pager and talking points, downloadable as one HTML file

It is an introductory accelerator only. It does not make legal, zoning or financial determinations.

## How it works

- `public/index.html`: the whole frontend (no build step).
- `api/*.js`: serverless functions. Claude is called **only on the server** with your API key, so testers don't need Claude accounts.
- Sign-in uses one demo account set by environment variables, with an HMAC-signed, HttpOnly session cookie.
- `server.js`: runs the same app locally or on any Node host (Render, Railway, Fly).
- No npm dependencies. Node 20 or newer.

## Deploy to Vercel (about 10 minutes)

1. Put this folder in a GitHub repository.
2. In Vercel, choose **Add New → Project**, import the repo, and keep the framework preset as **Other**.
3. Under **Environment Variables**, add:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | your key from console.anthropic.com |
| `SESSION_SECRET` | a long random string (e.g. output of `openssl rand -hex 32`) |
| `DEMO_EMAIL` | `demo@church.test` (or your choice) |
| `DEMO_PASSWORD` | a password you'll give testers |
| `ANTHROPIC_MODEL` | optional, defaults to `claude-sonnet-5-5` |
| `AI_LIMIT_PER_HOUR` | optional, defaults to `30` |

4. Deploy. Your link is the `*.vercel.app` URL Vercel shows.

`vercel.json` allows API functions up to 60 seconds, since a feasibility read can take 20 to 45 seconds. If your Vercel plan caps duration lower, raise the plan or host with `server.js` instead.

## Run locally

```bash
cp .env.example .env      # then fill in values
NODE_ENV=development npm run dev
# open http://localhost:3000
```

Set `MOCK_AI=true` to get canned sample output without an API key (a banner says so in the app). Turn it off before you submit.

## What to give testers

- Link: your deployed URL
- Email: the `DEMO_EMAIL` value
- Password: the `DEMO_PASSWORD` value
- Tip: the page loads with a demo church and a **mock** zoning code. Click "Get feasibility read," then "Create presentation materials."

## Cost and safety

- Every feasibility read and presentation is a Claude API call billed to your key. Set a monthly spend limit in the Anthropic Console.
- The per-session hourly limit and the sign-in attempt limit are in-memory, so on serverless they are a speed bump, not a guarantee.
- Change `DEMO_PASSWORD` after judging, or remove the env var to disable sign-in.
- Inputs are length-capped and the server recomputes site numbers before building prompts.

## Not built yet

- Address lookup and parcel data (Regrid, OpenStreetMap, municipal zoning portals). Users type lot details and paste zoning text.
- PowerPoint export. The download is an HTML file that prints cleanly to PDF.
- Multiple user accounts or saved projects.
