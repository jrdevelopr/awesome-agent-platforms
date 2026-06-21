# agents — Awesome Agent Platforms comparison site (tracked)

Public one-page comparison of self-hosted (and notable paid) AI agent platforms.

- **Public URL:** https://agents.jrdevelopr.site — **ungated / open** (shareable; NO lab-gate).
- **Local:** http://192.168.20.108:8088
- **Type:** docker, self-managed. `caddy:2-alpine` file-server serving `site/` on host port 8088.
- **Bring up:** `cd ~/apps/agents && docker compose -p agents up -d`
- **Caddy route:** `~/server-setup/caddy/apps.d/agents.caddy` — **no `import gate`** (deliberately open).

> **Skill:** invoke the **`agents-site`** skill (`~/.claude/skills/agents-site/SKILL.md`) when
> adding/editing any tab entry — it has the exact per-tab schema, enum maps, render harness and
> the full board→icons→stars→verify→commit workflow.

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
Cost (paid clearly marked + price) · **Sub login** · GitHub Issues sync · GitHub Projects · PRs/push ·
one-click human shell · agents/models (concise) · multiple logins (per-client subscription
isolation) · deploy/fleet · bottom line.

**`sub` field** (`{s:'yes'|'partial'|'no', note}`): can you sign in with a **Claude Pro/Max & ChatGPT/Codex
subscription** (typically via the official Claude Code / Codex CLIs' OAuth) instead of paying per-token API
keys? `yes` = both via the CLIs; `partial` = one side only (Claude-only / Codex-only) or with caveats;
`no` = API key / BYOK only, or its own proprietary subscription. Grounded in each row's documented agent CLIs.
Rendered right after Cost (mark in collapsed row, note in the expanded detail, cap on mobile cards).

## Tabs — Platforms | Providers | Agent Tools | AI building blocks
The page is a **tabbed UI** (`.tabs` bar; `#view-platforms` / `#view-providers` / `#view-tools` /
`#view-blocks` sections; deep-links `#providers` `#tools` `#blocks`). Wiring lives in the
`VIEWS`/`showTab()` block at the end of `<script>` — to add a tab, register it in `VIEWS`, add a
`apply<X>()` branch in `showTab`, set its `tabn-<x>`/`<x>countEy` counts, and add it to the
init-hash whitelist `['tools','providers','blocks']`. More tabs can be added by cloning the pattern.
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
- **Tab 4 = AI building blocks** — the **`BLOCKS` array** in `site/index.html`: embeddable AI
  capabilities you wire **into** your own apps/sites/agents (voice TTS/STT, image, video, music,
  embeddings/search, documents/OCR, media-inference clouds) — distinct from the LLM *providers*
  that run coding agents. Each BLOCKS object:
  `name,url,link,cap,cost{t,label,price},bestFor[],apiCompat{v,note},privacy{v,note},selfHost{s,note},models,stars,icon,summary,verdict`.
  - `cap` ∈ `voice|image|video|music|embeddings|docs|mediainfra` (drives the colored `capBadge`
    — reuses the `.catbadge`/`.cat-*` classes — and the capability filter chips in `#bstats`). To
    add a capability, extend the `BCAT` map.
  - `bestFor`/`apiCompat`/`privacy` reuse the **same `.pill` system + `BESTFOR`/`APICOMPAT`/`PRIVACY`
    maps** as the Providers tab (the BLOCKS seed added media keys to `BESTFOR`:
    `realtime|multilingual|production|creative`). Same responsive priority — Privacy hides first
    (`.c-priv`), then API compat (`.c-api`); Best-for stays longest. 10-column table.
  - Sorted **A→Z** at render (star-sort toggle in the header, like the other tabs); render reuses
    `starsEl`, `costCell`, `markSym`, `prettyLink`, `CHEV`, `EXT` + the `.pill` helpers.
  - **Gemini 3.1 Flash TTS** is cross-linked: it's a BLOCKS row *and* listed in the Google DeepMind
    Models cell on the Providers tab (with a `voice` Best-for badge). Keep both in sync.

## Providers tab — extra columns
Each `PROVIDERS` object also carries three compact-badge fields (rendered via the shared `.pill`
system + `BESTFOR`/`APICOMPAT`/`PRIVACY` maps):
- **`bestFor`** (array, 2–3 keys ∈ `coding|agents|chat|rag|embeddings|voice|local|enterprise|cheap`) →
  "Best for" badge cluster. Empty/missing → a single muted `Unknown` pill.
- **`apiCompat`** (`{v,note}`, `v ∈ openai|native|partial|sdk|local|unknown`) → "API compat" pill;
  `note` shows in the expanded row + mobile card.
- **`privacy`** (`{v,note}`, `v ∈ notrain|retention|enterprise|local|unknown`) → "Privacy" pill
  (conservative; never guess — use `unknown` when unclear).
- **Responsive priority:** the providers table is replaced by cards <1180px; between 1180–1499px the
  **Privacy** column hides (`.c-priv`), and <1360px **API compat** also hides (`.c-api`) — **Best for**
  stays visible longest. Detail-row cells share those classes so they hide in sync (alignment stays 11 cols).

## Icons
`bin/fetch-icons.js` fetches favicons for **all four** arrays — `PLATFORMS`, `TOOLS`, `PROVIDERS` and `BLOCKS` (GitHub org/`github.io`
avatar for repo-hosted, site favicon else, SVG lettered-tile fallback). **It names each file by its
TRUE mime type** (e.g. an SVG served at `/favicon.ico` is saved `.svg`, not `.ico`) so the browser
never gets a content-type mismatch. All icons are stored locally under `site/icons/` — **never
hotlinked**. Verify with the Node DOM-stub render (row counts + 0 `undefined`).

## GitHub stars (sorting depends on them)
The site's star-sort uses each entry's `stars` field, so **every repo-backed entry must carry a
live count**; closed-source SaaS with no public repo legitimately stays `stars:null` (renders `— ☆`).
- **`bin/refresh-stars.js`** refreshes all four arrays from the GitHub API (`gh api repos/:owner/:repo
  --jq .stargazers_count`). It resolves each entry's repo from **(1)** an explicit `"repo":"owner/name"`
  field, else **(2)** the entry's `github.com` URL. Entries with neither are left **exactly as-is**
  (existing value preserved — it never nulls a value it can't resolve). Re-runnable any time; the
  weekly `discover.sh` cron calls it before fetch-icons/gen-readme so stars stay current.
- **Add a `repo` field** to any open-source entry whose `url` is a marketing homepage (e.g.
  Ollama→`ollama/ollama`, FLUX→`black-forest-labs/flux`, Qwen→`QwenLM/Qwen3`) so it auto-refreshes.
  Pick the **canonical flagship repo** for multi-repo orgs (a -6000 swing on re-run = wrong repo).
