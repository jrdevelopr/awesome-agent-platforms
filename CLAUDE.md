# agents — Awesome Agent Platforms comparison site (tracked)

Public one-page comparison of self-hosted (and notable paid) AI agent platforms.

- **Public URL:** https://agents.jrdevelopr.site — **ungated / open** (shareable; NO lab-gate).
- **Local:** http://192.168.20.108:8088
- **Type:** docker, self-managed. `caddy:2-alpine` file-server serving `site/` on host port 8088.
- **Bring up:** `cd ~/apps/agents && docker compose -p agents up -d`
- **Caddy route:** `~/server-setup/caddy/apps.d/agents.caddy` — **no `import gate`** (deliberately open).

## Editing the data (the common task)
All platform rows are a JS array `PLATFORMS` in **`site/index.html`**. To add/update a platform,
add or edit one object (name, url, cost, ghIssues/ghProjects/prs/shell/multi as
`yes`/`partial`/`no` + optional note, agents text, deploy, `stars` (GitHub stargazers, int or
null), and a sentiment-based `verdict`/bottom line — what real users say). The table + filters
render from that array, which is **sorted alphabetically by name (A→Z) at render time** (source
order doesn't matter — no personal ranking). The **Bottom Line is sentiment-based** (Reddit/HN/
GitHub feedback) and should be refreshed periodically. After editing: `docker compose -p agents
restart web` (volume is read-only mounted live, so a restart isn't even required — just reload).

## Columns
Cost (paid clearly marked + price) · GitHub Issues sync · GitHub Projects · PRs/push ·
one-click human shell · agents/models (concise) · multiple logins (per-client subscription
isolation) · deploy/fleet · bottom line.

## Tabs — Platforms | Agent Tools
The page is a **tabbed UI** (`.tabs` bar; `#view-platforms` / `#view-tools` sections; deep-link
`#tools`). More tabs can be added later by cloning the pattern.
- **Tab 1 = Platforms** — the `PLATFORMS` array (unchanged; full capability matrix).
- **Tab 2 = Agent Tools** — the **`TOOLS` array** in `site/index.html`: drop-in add-ons that plug
  INTO agents (memory, computer-use, web access, skills, model routing, security, monitoring).
  Seeded from the ManuAGI "10 Best FREE AI Agent Tools" video. Each TOOLS object:
  `name,url,link,cat,cost{t,label,price},type,worksWith,selfHost{s,note},setup,stars,icon,summary,verdict`.
  - `cat` ∈ `web|computer|memory|coding|skills|security|router|monitoring` (drives the colored
    `catBadge` + the category filter chips in `#tstats`). To add a category, extend the `CAT` map.
  - `type` = how it plugs in (MCP server / CLI / Skill pack / Gateway / Desktop app …);
    `worksWith` = compatible agents; `setup` = the install one-liner (shown in a `<code>` cell).
  - Sorted **A→Z** at render (star-sort toggle in the Tool header, like Platforms).
  - Tools render reuses the platform helpers (`starsEl`, `costCell`, `markSym`, `CHEV`, `noteTd`).
  - Hermes Agent stays on the **Platforms** tab (it's a full agent, not an add-on) — not duplicated.

## Icons
`bin/fetch-icons.js` fetches favicons for **both** `PLATFORMS` and `TOOLS` (GitHub org/`github.io`
avatar for repo-hosted, site favicon else, SVG lettered-tile fallback). **It names each file by its
TRUE mime type** (e.g. an SVG served at `/favicon.ico` is saved `.svg`, not `.ico`) so the browser
never gets a content-type mismatch. All icons are stored locally under `site/icons/` — **never
hotlinked**. Verify with the Node DOM-stub render (row counts + 0 `undefined`).
