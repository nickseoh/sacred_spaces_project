# Sacred Spaces, Safe Homes

**A feasibility and visioning copilot that helps churches explore affordable housing on their land.**

Many churches own large properties, like parking lots that sit empty six days a week, but zoning rules, neighbor opposition, feasibility studies and financing overwhelm leaders without real estate experience. This prototype takes a pastor or church board from a property's basic details to a plain-language feasibility snapshot and a presentation they could show their board and city council, in minutes.

Built for **Track 3.1: Sacred Spaces, Safe Homes**.

**Live demo:** https://sacredspaces.vercel.app
**Demo account:** provided to judges and testers separately.

> This is an introductory accelerator, not a decision-making tool. It does not make legal, zoning or financial determinations. Every finding needs review by an architect, land-use attorney or city planner.

---

## What it does

**Site sketch and unit estimate.** Enter lot dimensions, the church building's footprint, parking to keep, setbacks, density and parking ratios. A sketch of the lot updates as you type, showing setback lines, the church, retained parking and housing blocks. Alongside it is a rough unit estimate that names the rule limiting it (density, or land and parking).

**Feasibility read.** Claude writes a one-sentence summary, an overall verdict, and a table of the rules that apply to the lot.

**No made-up zoning rules.** A rule gets a section number only if that section appears in the zoning text the user pasted. Anything else is marked **"Unverified: confirm with planner."**

**Obstacles and counterpoints.** Likely hurdles (variances, parking minimums, neighbor concerns), each with a respectful, mission-driven counterpoint and the type of expert to ask.

**Preliminary financing sketch.** Possible funding sources such as Low-Income Housing Tax Credits and faith-based housing funds, with no specific amounts, clearly marked as preliminary.

**Presentation materials.** Slides with speaker notes, a one-pager, and talking points for the church board, neighbors and city council. They download as a single HTML file that prints to PDF.

## Try it

1. Open the [live demo](https://sacredspaces.vercel.app) and sign in with the demo account.
2. The form loads with a sample church and a **mock** zoning code. Change any values or paste real zoning text.
3. Click **Get feasibility read**. It takes up to about a minute.
4. Click **Create presentation materials**, then browse the Slides, One-pager and Talking points tabs.
5. Click **Save presentation file** to download.

## How it works

```
Browser (public/index.html)
   │  sign-in, inputs, site sketch, results
   ▼
Serverless API (api/*.js on Vercel)
   │  checks session, cleans inputs, recomputes site math, builds prompts
   ▼
Claude API (called server-side only)
```

- The Anthropic API key stays on the server. Testers never need a Claude account.
- Sign-in uses a single demo account set by environment variables. The session is an HMAC-signed, HttpOnly cookie that lasts 12 hours.
- The server recomputes the site numbers itself rather than trusting the browser, and caps input lengths before building prompts.
- There are no npm dependencies and no build step.

## Project structure

```
api/
  login.js          sign in with the demo account
  logout.js         sign out
  session.js        check whether the visitor is signed in
  feasibility.js    feasibility read from Claude
  presentation.js   slides, one-pager and talking points from Claude
lib/
  auth.js           session cookies, credential check, rate limits
  calc.js           site math (also mirrored in the frontend)
  claude.js         Claude API call and JSON parsing
  prompts.js        prompt templates and guardrails
  mock.js           canned output for MOCK_AI mode
  http.js           shared request/response helpers
public/
  index.html        the whole frontend
server.js           runs the app locally or on any Node host
vercel.json         Vercel settings (60-second function limit)
.env.example        template for environment variables
```

## Deploy your own

### Vercel

1. Fork or clone this repository and import it into [Vercel](https://vercel.com). Leave **Framework Preset** as **Other**.
2. Add these environment variables for **Production** and **Preview**:

| Variable | Required | What it is |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your key from [console.anthropic.com](https://console.anthropic.com) |
| `SESSION_SECRET` | Yes | A long random string you create (32+ characters), e.g. `openssl rand -hex 32` |
| `DEMO_EMAIL` | Yes | The sign-in email testers will use, e.g. `demo@church.test` |
| `DEMO_PASSWORD` | Yes | The password testers will use |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5-5` |
| `AI_LIMIT_PER_HOUR` | No | Claude requests per session per hour. Defaults to `30` |
| `MOCK_AI` | No | Set to `true` to return canned sample output without calling Claude |

3. Deploy. If you change a variable later, redeploy from the **Deployments** tab for it to take effect.

A feasibility read can take 20 to 45 seconds. `vercel.json` allows functions up to 60 seconds. If your plan caps duration lower, upgrade the plan or host with `server.js`.

### Run locally

Requires Node.js 20 or newer.

```bash
cp .env.example .env    # fill in the values
NODE_ENV=development npm run dev
# open http://localhost:3000
```

Set `MOCK_AI=true` in `.env` to try the full flow without an API key. A banner in the app shows when sample output is being used.

### Other hosts

`npm start` runs `server.js`, which serves the frontend and API routes on any Node host (Render, Railway, Fly.io). Set the same environment variables there.

## Safety and cost

- **Never commit `.env` or your API key.** `.gitignore` excludes `.env`.
- Every feasibility read and presentation is a Claude API call billed to the key owner. Set a monthly spend limit in the Anthropic Console.
- Sign-in attempts and Claude requests are rate-limited in memory. On serverless hosts this is per instance, so treat it as a speed bump rather than a guarantee.
- After judging, change or remove `DEMO_PASSWORD` and redeploy to close access.

## Limitations

- **No automatic address or parcel lookup yet.** Users type lot details and paste zoning text themselves.
- The site sketch is illustrative massing only, not a site plan. It assumes 330 sq ft per parking space and reserves 30% of open land for paths and yards.
- The sample zoning code is **mock data** and does not describe any real jurisdiction.
- Presentations download as HTML, not PowerPoint.
- There is one shared demo account. Projects are not saved between sessions.

## Roadmap

- Address lookup with parcel and zoning data from Regrid, OpenStreetMap and municipal open-data portals
- Pilot with a real church parcel, with one output reviewed by a land-use attorney or planner
- One-click PowerPoint export for council presentations
- Individual accounts and saved projects
- A more detailed massing render

## Disclaimer

This tool provides an early, informal look at possibilities. It is not legal, zoning, architectural or financial advice and does not replace professional review. Always confirm findings with your city's planning department and qualified professionals before making decisions.
