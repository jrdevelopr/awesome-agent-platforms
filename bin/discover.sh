#!/usr/bin/env bash
# Weekly auto-discovery: find NEW AI agent platforms and add them to the Awesome Agent Platforms
# comparison site (~/apps/agents/site/index.html), verify, commit & push (list is alphabetical).
# Runs a headless Claude Code agent. Invoked by cron (see `crontab -l`).
set -uo pipefail
export HOME=/home/jrdevelopr
export PATH="$HOME/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
REPO="$HOME/apps/agents"
LOG="$REPO/discover.log"
LOCK="/tmp/agents-discover.lock"

# single-instance guard
exec 9>"$LOCK" || exit 0
flock -n 9 || { echo "$(date) — another run in progress, skipping" >>"$LOG"; exit 0; }

cd "$REPO" || exit 1
git pull --quiet origin main 2>/dev/null || true

read -r -d '' PROMPT <<'EOF'
You maintain a PUBLIC comparison site of AI coding-agent platforms. The data is a JavaScript
array named PLATFORMS inside the single file ~/apps/agents/site/index.html. Your task this run:
find agent platforms NOT already in that array and add them, accurately, then verify and ship.

DISCOVERY — fetch these curated lists (use the Bash tool with curl) and scan for platform names:
  curl -fsSL https://raw.githubusercontent.com/bradAGI/awesome-cli-coding-agents/main/README.md
  curl -fsSL https://raw.githubusercontent.com/andyrewlee/awesome-agent-orchestrators/main/README.md
  curl -fsSL https://raw.githubusercontent.com/ai-for-developers/awesome-ai-coding-tools/main/README.md
If web-search tools are available, you may also look for "new self-hosted AI coding agent platform".

RULES:
1) Only ADD platforms genuinely missing from the current PLATFORMS array (compare by name,
   case-insensitive). NEVER delete or rewrite existing entries' facts — you may only reorder.
2) Match the EXACT object shape of existing entries (each capability cell is an object
   {"s":"yes|partial|no","note":"..."}). EVERY field present: name,url,link,cost{t,label,price},
   selfHosted, ghIssues, ghProjects, prs, shell, multi, mobile, desktop (all as {s,note}),
   agents (concise string e.g. "Claude, Codex + many more"), agentsCnt, agentsBeyond
   ('yes'/'partial'/'no'), deploy, verdict, summary (neutral one-line description, no sentiment),
   stars (GitHub stargazers int or null). **selfHosted** = can it run 100% on the user's own
   machines (not the vendor's servers)? **desktop** = is there a native desktop app? **ghIssues** =
   whether it SYNCS GitHub issues (note just says e.g. "no issue sync"). **ghProjects** is now the
   PROJECTS column = does the platform have its OWN project/task management (board/kanban/tickets)
   or PM-tool integration (Linear/Jira/GitHub Projects) — NOT GitHub Projects specifically. Do NOT
   add a `lab` field (privacy).
3) BE ACCURATE AND CONSERVATIVE. Mark a capability 'yes' only when the project's own docs/repo
   clearly support it; otherwise 'partial' or 'no'. Mark paid products cost.t:'paid' with a price
   if known. Prefer truth over completeness — when unsure, use 'partial' or '–'.
4) DO NOT rank by preference. The list is ordered ALPHABETICALLY by name (A→Z) — the site and
   README both sort at render time, so just insert each new platform as a well-formed object; order
   in the source array does not matter. For each new platform also fill `stars` (current GitHub
   stargazers count, integer, or null if no public repo) and a neutral sentiment-based `verdict`
   (what real users say — praise + main gripe; be honest if it's too new for feedback, no invented
   quotes). Keep existing flags as-is.
5) VERIFY before shipping: run a Node DOM-stub render of the script (same technique used previously
   in this repo) and confirm the table row count INCREASED and there are ZERO "undefined" leaks and
   no JS errors. If verification fails, revert your edit and STOP without committing.
6) Only if you added >= 1 new platform AND verification passed: `git add -A`, commit with a message
   listing the platforms added (and a Co-Authored-By: Claude trailer), then `git push origin main`.
   If nothing genuinely new was found, make NO commit. Touch nothing outside ~/apps/agents.
EOF

{
  echo "================ $(date) — discovery run ================"
  before=$(grep -c "name:'" "$REPO/site/index.html" 2>/dev/null || echo '?')
  echo "platforms before: $before"
  timeout 1200 claude -p "$PROMPT" --dangerously-skip-permissions 2>&1
  # refresh live GitHub stars for every repo-backed entry (sorting depends on them)
  node "$REPO/bin/refresh-stars.js" 2>&1 || true
  # refresh favicons (new platforms get a fetched icon or an SVG fallback) + keep README in sync
  node "$REPO/bin/fetch-icons.js" 2>&1 || true
  node "$REPO/bin/gen-readme.js" 2>&1 || true
  if [ -n "$(git -C "$REPO" status --porcelain 2>/dev/null)" ]; then
    git -C "$REPO" add -A
    git -C "$REPO" -c user.email=jrdevelopr@gmail.com -c user.name=jrdevelopr commit -q -m "Refresh favicons + regenerate README from updated platform data" 2>/dev/null
    git -C "$REPO" push origin main 2>/dev/null && echo "icons + README synced + pushed"
  fi
  after=$(grep -c "name:'" "$REPO/site/index.html" 2>/dev/null || echo '?')
  echo "platforms after: $after"
  echo "================ done $(date) ================"
} >>"$LOG" 2>&1
