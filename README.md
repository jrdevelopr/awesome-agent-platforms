<!-- This file is AUTO-GENERATED from site/index.html by bin/gen-readme.js. Do not edit by hand. -->
# ⚖️ Agent Arena — Self-Hosted AI Agent Platform Comparison

### ▶︎ Live, interactive version: **https://agents.jrdevelopr.site**

A continuously-updated comparison of self-hosted (and a few notable paid) **AI coding-agent platforms**.
The goal: **one tool that does everything** — open an interactive shell, pull a GitHub issue, run any
agent CLI, and ship a PR, without tab-hopping to a separate terminal.

**Ranked by** (best fit first): one-click **human shell** · **GitHub** issue sync + PRs/push ·
**many agents/models** (beyond Claude & Codex) · **multiple logins** (separate client subscriptions) ·
**mobile** access. Self-hosted & free preferred; paid options are included and clearly marked.

**Legend:** ✅ native / strong · 🟡 partial / context-only · ➖ not documented &nbsp;|&nbsp;
*Multiple logins* = isolate separate Claude/agent subscriptions per project. *Mobile* ✅ = app or
mobile-first; 🟡 = mobile browser / chat; ➖ = desktop / SSH only.

| # | Platform | Cost | GitHub Issues | GH Projects | PRs / push | One-click shell | Multiple logins | Mobile | Agents / models | Bottom line |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **[Emdash](https://emdash.sh)** | Free <br><sub>Apache-2.0</sub> | ✅ | ➖ | ✅ | ✅ | ✅ | ➖<br><sub>Desktop app only (Mac/Win/Linux)</sub> | Claude, Codex, Gemini, OpenCode, Kilo + many more | Best overall fit — agent, diff, editor, terminal & in-app browser in one window. Gaps: desktop (not browser) control plane; no Projects sync. |
| 2 | **[Paseo](https://github.com/getpaseo/paseo)** | Free <br><sub>open-source</sub> | 🟡 | ➖ | 🟡 | ✅ | 🟡 | ✅<br><sub>Mobile client (iOS/Android) + desktop/web/CLI</sub> | Dozens of coding-agent CLIs | Very close on shell, models and hosts. GitHub issue/project sync is the weak spot. |
| 3 | **[CloudCLI](https://github.com/siteboon/claudecodeui)** | Free <br><sub>GPL-3</sub> | 🟡 | ➖ | 🟡 | ✅ | 🟡 | ✅<br><sub>Mobile-optimized web UI (use on the go)</sub> | Claude, Codex, Gemini, Cursor, OpenCode | Best lightweight browser demo; excellent shell. Fleet management is the gap. |
| 4 | **[RCFlow](https://www.rcflow.app)** | Free <br><sub>AGPL</sub> | ➖ | ➖ | ➖ | ✅ | 🟡 | ✅<br><sub>Mobile client (+ desktop)</sub> | Claude, Codex, OpenCode (Anthropic/Bedrock/OpenAI-compat) | Strong shell + multi-host candidate. Main gap is GitHub sync; project is very new. |
| 5 | **[Coder](https://coder.com)** | OSS + Cloud <br><sub>free core · Premium $$</sub> | 🟡 | ➖ | 🟡 | ✅ | ✅ | 🟡<br><sub>Web (responsive); no native app</sub> | Terminal/MCP agents, built-in modules, custom agents | Best shell + infrastructure platform. Heavier setup, less issue-centric. |
| 6 | **[Claude Plane](https://github.com/kodrunhq/claude-plane)** | Free <br><sub>open-source</sub> | 🟡 | ➖ | 🟡 | ✅ | 🟡 | 🟡<br><sub>Mobile browser terminal</sub> | Claude CLI only | Best true browser shell/fleet newcomer. Major drawback: Claude-only & very young. |
| 7 | **[Agentrove](https://github.com/Mng-dev-ai/agentrove)** | Free <br><sub>open-source</sub> | ➖ | ➖ | ✅ | ✅ | ✅ | 🟡<br><sub>Web (responsive); desktop app too</sub> | Claude, Codex, Copilot, Cursor, OpenCode | Promising all-in-one workspace. Young — maintainers warn of breaking changes. |
| 8 | **[Jean](https://github.com/coollabsio/jean)** | Free <br><sub>Apache-2.0</sub> | 🟡 | ➖ | ✅ | ✅ | ➖ | 🟡<br><sub>Headless web access over HTTP (mobile browser)</sub> | Claude, Codex, Cursor, OpenCode + MCP | Strong single-box fit — in-UI terminal, Claude/Codex/Cursor/OpenCode, GitHub Issues/PR dashboard with real PRs. Gaps: desktop-first, no Projects, no multi-login. |
| 9 | **[AgentOS](https://github.com/saadnvd1/agent-os)** | Free <br><sub>open-source</sub> | ➖ | ➖ | 🟡 | ✅ | 🟡 | ✅<br><sub>Mobile-first web (PWA) — designed for phones</sub> | Claude, Codex, OpenCode, Kilo, Gemini, Aider, Cursor, Amp, Pi + more | Good mobile shell. Weak point is external issue/project sync. |
| 10 | **[AgentsMesh](https://agentsmesh.ai)** | OSS + Cloud <br><sub>BSL-1.1 · self-host · BYOK cloud</sub> | ➖ | ➖ | 🟡 | ✅ | 🟡 | ✅<br><sub>Native iOS (SwiftUI) client + web / tablet</sub> | Claude, Codex, Gemini, Aider, OpenCode + custom (MCP) | Most complete platform here — web/desktop/iOS clients, real PTY pods, many agents, true multi-machine runners. Gaps: own ticket board (no GitHub Issues), BSL license for prod. |
| 11 | **[Conductor](https://conductor.build)** | Free <br><sub>proprietary · BYO Claude/Codex</sub> | ✅ | ➖ | ✅ | ✅ | ➖ | ➖<br><sub>macOS desktop app only</sub> | Claude Code, Codex, Cursor (+ Bedrock / Vertex / OpenRouter) | Polished Mac-native issue→terminal→PR flow with review/CI fixes. But closed-source, macOS-only (no Linux self-host), no mobile, no multi-login. |
| 12 | **[cmux](https://github.com/manaflow-ai/cmux)** | OSS + Cloud <br><sub>GPL-3 · paid Founder tier</sub> | ➖ | ➖ | 🟡 | ✅ | ➖ | 🟡<br><sub>Early-access iOS app; macOS desktop</sub> | Claude, Codex, Gemini, Grok, Cursor, Copilot, Amp, OpenCode, Pi + more | Slick native terminal with the widest agent roster (13). But single-Mac desktop — no GitHub Issues/Projects, no fleet, no multi-login. |
| 13 | **[OpenCode](https://opencode.ai)** | Free <br><sub>open-source</sub> | ✅ | ➖ | ✅ | 🟡 | 🟡 | 🟡<br><sub>Mobile browser (web UI) / terminal</sub> | Any of 75+ providers incl. free & local models | Excellent runtime + GitHub issue worker. It is an agent, not a fleet manager by itself. |
| 14 | **[Kilo.ai](https://kilo.ai)** | OSS + Cloud <br><sub>BYOK free · cloud paid</sub> | ✅ | ➖ | ✅ | 🟡 | ✅ | 🟡<br><sub>Cloud web console in mobile browser</sub> | Hundreds of models, BYOK + local | Best model freedom + GitHub issue workflow. Does not solve the server-shell need. |
| 15 | **[mux](https://github.com/coder/mux)** | Free <br><sub>AGPL-3</sub> | ➖ | ➖ | 🟡 | 🟡 | ➖ | 🟡<br><sub>Server mode = responsive mobile web</sub> | Claude, GPT / Codex, Grok, Ollama, OpenRouter models | Open-source (AGPL) multi-model runner with SSH remotes + mobile-web server mode. GitHub work runs through the agent gh CLI; no Issues sync or a documented human terminal. |
| 16 | **[Netclode](https://github.com/angristan/netclode)** | Free <br><sub>open-source</sub> | ➖ | ➖ | ➖ | ✅ | ✅ | ➖<br><sub>SSH client only (Tailscale)</sub> | Any harness — Claude, Codex, OpenCode, Copilot | Powerful but complex — more cloud-agent lab than a simple fleet manager. |
| 17 | **[SwarmClaw](https://swarmclaw.ai)** | Free <br><sub>MIT</sub> | ➖ | ➖ | 🟡 | 🟡 | 🟡 | 🟡<br><sub>Mobile-friendly responsive web</sub> | Claude, Codex, OpenCode, Gemini, Copilot, Cursor, Qwen, Goose + 24 providers | Best agent/model breadth (8 CLIs + 24 providers) with git tooling and flexible deploy. No GitHub Issues/Projects/PR glue; isolation only partial. |
| 18 | **[OpenASE](https://github.com/PacificStudio/openase)** | Free <br><sub>Apache-2.0</sub> | ➖ | ➖ | 🟡 | 🟡 | ✅ | ➖<br><sub>Mobile / desktop apps on roadmap; web only now</sub> | Claude, Codex, Gemini CLI | Multi-org control plane with per-org isolation and multi-machine reach. Runs its own tickets (no GitHub Issues), no real human shell, mobile is roadmap. |
| 19 | **[Hermes Agent](https://github.com/NousResearch/hermes-agent)** | Free <br><sub>Nous Research</sub> | ➖ | ➖ | 🟡 | 🟡 | 🟡 | 🟡<br><sub>Drive via Telegram / WhatsApp / Slack + web dashboard</sub> | Model-agnostic (OpenRouter or direct: Claude, GPT, local…) | Self-improving agent with long-term memory. Messaging-gateway focus, not a shell fleet. |
| 20 | **[Sortie](https://github.com/sortie-ai/sortie)** | Free <br><sub>Apache-2.0</sub> | ✅ | ➖ | 🟡 | ➖ | ➖ | ➖<br><sub>Headless daemon — no UI</sub> | Claude, Codex, Copilot, OpenCode, Kiro | Cleanest issue-driven autopilot — point it at a repo + label and it grinds issues to a review state. But headless: no shell, no mobile, no multi-login. |
| 21 | **[Multica](https://multica.ai)** | Free <br><sub>open-source</sub> | 🟡 | ➖ | 🟡 | ➖ | 🟡 | 🟡<br><sub>Web (responsive)</sub> | Claude, Codex, Gemini, Cursor, Copilot, OpenCode, Kiro, Kimi + more | Excellent fleet orchestration — but the missing human shell is the deal-breaker. |
| 22 | **[Paperclip](https://github.com/paperclipai/paperclip)** | Free <br><sub>MIT</sub> | ➖ | ➖ | ➖ | ➖ | ✅ | 🟡<br><sub>Web (responsive) control plane</sub> | Any agent/provider/runtime via adapters | Great business-agent orchestrator (org chart of AI staff). Not a coding shell. |
| 23 | **[Vibe Kanban](https://github.com/BloopAI/vibe-kanban)** | Free <br><sub>open-source · sunsetting</sub> | 🟡 | ➖ | 🟡 | ✅ | 🟡 | 🟡<br><sub>Web (responsive)</sub> | Claude, Codex, Gemini, Copilot, Cursor, OpenCode, Qwen + | Feature-rich but sunsetting — don’t build a long-term workflow around it. |
| 24 | **[OpenClaw](https://github.com/openclaw/openclaw)** | Free <br><sub>open-source</sub> | 🟡 | ➖ | 🟡 | 🟡 | 🟡 | 🟡<br><sub>Via chat channels (Slack/Telegram/…)</sub> | Model-agnostic; thousands of pre-built tools/workflows | Huge batteries-included connector ecosystem, but frequent updates break instances. |
| 25 | **[Omnara](https://github.com/omnara-ai/omnara)** | OSS + Cloud <br><sub>legacy archived</sub> | ➖ | ➖ | ➖ | 🟡 | 🟡 | ✅<br><sub>iOS + Android app (monitor/control from phone)</sub> | Claude-centric (legacy: Claude/Codex) | Not a strong fit now — direction moved away from the open wrapper model. |
| 26 | **[Devin](https://devin.ai)** | 💲 **Paid** <br><sub>from ~$20/mo (teams $$$)</sub> | ✅ | ➖ | ✅ | 🟡 | ➖ | 🟡<br><sub>Web + Slack (drive from phone)</sub> | Devin’s own proprietary agent | Autonomous cloud engineer. Polished, but single proprietary agent and not self-hosted. |
| 27 | **[Cursor](https://cursor.com)** | 💲 **Paid** <br><sub>Pro $20/mo + usage</sub> | 🟡 | ➖ | ✅ | 🟡 | ➖ | 🟡<br><sub>Mobile web for background agents</sub> | Cursor models + some BYOK | Polished IDE with cloud background agents. Not self-hosted; not a server-shell fleet. |

---

### How this stays current
The table is generated from the data in **[`site/index.html`](site/index.html)** (a single `PLATFORMS`
array). A weekly bot scans curated lists of new agent platforms, adds any that are missing, re-ranks,
and regenerates both the live site and this README — so they never drift.

**Suggest a platform:** [open an issue](https://github.com/jrdevelopr/agents/issues/new?title=Suggest%20a%20platform:%20).

<sub>Ratings are based on official docs/repos; “➖”/“🟡” are used instead of guessing. GitHub Projects = GitHub's
boards, not a product's internal Kanban. Prices are list-price estimates and change often — verify before buying.
This is a personal, independent comparison, free to share.</sub>
