# agents — Agent Arena comparison site (tracked)

Public one-page comparison of self-hosted (and notable paid) AI agent platforms.

- **Public URL:** https://agents.jrdevelopr.site — **ungated / open** (shareable; NO lab-gate).
- **Local:** http://192.168.20.108:8088
- **Type:** docker, self-managed. `caddy:2-alpine` file-server serving `site/` on host port 8088.
- **Bring up:** `cd ~/apps/agents && docker compose -p agents up -d`
- **Caddy route:** `~/server-setup/caddy/apps.d/agents.caddy` — **no `import gate`** (deliberately open).

## Editing the data (the common task)
All platform rows are a JS array `PLATFORMS` in **`site/index.html`**. To add/update a platform,
add or edit one object (name, url, cost, ghIssues/ghProjects/prs/shell/multi as
`yes`/`partial`/`no` + optional note, agents text, deploy, verdict). The table + filters render
from that array. List is **ordered by owner preference** (best fit first). After editing:
`docker compose -p agents restart web` (volume is read-only mounted live, so a restart isn't
even required — just reload the page).

## Columns
Cost (paid clearly marked + price) · GitHub Issues sync · GitHub Projects · PRs/push ·
one-click human shell · agents/models (concise) · multiple logins (per-client subscription
isolation) · deploy/fleet · bottom line.
