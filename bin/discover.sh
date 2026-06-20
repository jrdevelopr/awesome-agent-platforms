#!/usr/bin/env bash
# Weekly auto-discovery: find NEW AI agent platforms and add them to the Agent Arena
# comparison site (~/apps/agents/site/index.html), re-rank, verify, commit & push.
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
find agent platforms NOT already in that array and add them, accurately, then re-rank and ship.

DISCOVERY — fetch these curated lists (use the Bash tool with curl) and scan for platform names:
  curl -fsSL https://raw.githubusercontent.com/bradAGI/awesome-cli-coding-agents/main/README.md
  curl -fsSL https://raw.githubusercontent.com/andyrewlee/awesome-agent-orchestrators/main/README.md
  curl -fsSL https://raw.githubusercontent.com/ai-for-developers/awesome-ai-coding-tools/main/README.md
If web-search tools are available, you may also look for "new self-hosted AI coding agent platform".

RULES:
1) Only ADD platforms genuinely missing from the current PLATFORMS array (compare by name,
   case-insensitive). NEVER delete or rewrite existing entries' facts — you may only reorder.
2) Match the EXACT object shape of existing entries. Every field present, same helper `c('yes'|'partial'|'no','note')`
   for ghIssues, ghProjects, prs, shell, multi, mobile. Keep the `agents` string concise
   (e.g. "Claude, Codex + many more"); set agentsCnt + agentsBeyond ('yes'/'partial'/'no').
3) BE ACCURATE AND CONSERVATIVE. Mark a capability 'yes' only when the project's own docs/repo
   clearly support it; otherwise 'partial' or 'no'. Mark paid products cost.t:'paid' with a price
   if known. Prefer truth over completeness — when unsure, use 'partial' or '–'.
4) RE-RANK the whole array by this owner's preference, best first: integrated one-click HUMAN shell
   + GitHub Issue sync + PR/push + many agents/models + multiple-login isolation + mobile access;
   self-hosted & free preferred, paid allowed but ranked lower if it fails the must-haves; tools
   with NO human shell rank low. Keep `lab:true` flags as-is.
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
  # keep README.md (the GitHub-rendered chart) in sync with the data, then push if changed
  node "$REPO/bin/gen-readme.js" 2>&1 || true
  if ! git -C "$REPO" diff --quiet README.md 2>/dev/null; then
    git -C "$REPO" add README.md
    git -C "$REPO" -c user.email=jrdevelopr@gmail.com -c user.name=jrdevelopr commit -q -m "Regenerate README from updated platform data" 2>/dev/null
    git -C "$REPO" push origin main 2>/dev/null && echo "README regenerated + pushed"
  fi
  after=$(grep -c "name:'" "$REPO/site/index.html" 2>/dev/null || echo '?')
  echo "platforms after: $after"
  echo "================ done $(date) ================"
} >>"$LOG" 2>&1
