#!/usr/bin/env node
// Generate README.md (a static markdown comparison table) from the SAME PLATFORMS
// data that drives site/index.html — so GitHub shows the chart, always in sync.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// --- extract the PLATFORMS array by running the page's data script in a DOM stub ---
const html = fs.readFileSync(path.join(ROOT, 'site/index.html'), 'utf8');
const scriptBody = html.split('<script>').pop().split('</script>')[0]; // the big data+render script
const el = () => ({ set innerHTML(v){}, get innerHTML(){return '';}, set textContent(v){}, set hidden(v){},
  classList:{add(){},remove(){},toggle(){},contains(){return false;}}, addEventListener(){},
  querySelector(){return el();}, querySelectorAll(){return [];}, setAttribute(){}, getAttribute(){return null;},
  removeAttribute(){}, closest(){return null;}, dataset:{} });
const documentStub = {
  documentElement: el(), getElementById: el, querySelector: el, querySelectorAll: () => [], addEventListener(){}
};
const fn = new Function('document','window','navigator','location','localStorage',
  scriptBody + '\nreturn PLATFORMS;');
const P = fn(documentStub, { addEventListener(){} }, {}, { href:'', search:'', pathname:'/' }, { getItem:()=>null, setItem(){} });
// Neutral order for everyone: alphabetical by name (A→Z), matching the site.
P.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

// --- helpers ---
const MARK = { yes:'✅', partial:'🟡', no:'➖' };
const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
const cost = c => c.t === 'paid' ? `💲 **Paid** <br><sub>${esc(c.price)}</sub>`
              : c.t === 'hybrid' ? `**Freemium** <br><sub>${esc(c.price)}</sub>`
              : `Free <br><sub>${esc(c.price)}</sub>`;

const header = `<!-- This file is AUTO-GENERATED from site/index.html by bin/gen-readme.js. Do not edit by hand. -->
# AI Builders Toolkit

[![Live site](https://img.shields.io/badge/live-agents.jrdevelopr.site-2563eb?logo=googlechrome&logoColor=white)](https://agents.jrdevelopr.site) [![Platforms](https://img.shields.io/badge/platforms-${P.length}-0e9f6e)](https://agents.jrdevelopr.site) [![Auto-updated weekly](https://img.shields.io/badge/auto--updated-weekly-7c3aed)](bin/discover.sh) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> An **alphabetical, self-hosted-first** comparison of AI coding-agent platforms — find the best tool to **run and manage AI coding agents** from one place.

### ▶︎ Live, interactive version → **https://agents.jrdevelopr.site**

The goal: **one tool that does everything** — open an interactive shell, pull a GitHub issue, run any
agent CLI, and ship a PR, without tab-hopping to a separate terminal.

**Listed alphabetically** (A→Z) — no personal ranking. **Compared on:** **self-hosted** (runs on *your*
machines) · **subscription login** (sign in with your Claude Pro/Max & ChatGPT/Codex subscription instead of
metered API keys) · one-click **human shell** · **GitHub** issue sync + PRs/push · **many agents/models** (beyond
Claude & Codex) · **multiple logins** (separate client subscriptions) · **mobile** access · GitHub stars &
user sentiment. Free & self-hosted preferred; paid options are included and clearly marked.

**Legend:** ✅ native / strong · 🟡 partial / context-only · ➖ not documented &nbsp;|&nbsp;
*Self-hosted* ✅ = runs entirely on your own machines (not the vendor's cloud). *Sub login* ✅ = sign in with
your Claude Pro/Max & ChatGPT/Codex subscription (usually via the official Claude Code / Codex CLIs) instead of
per-token API keys; 🟡 = one side only or with caveats; ➖ = API key / BYOK only. *Multiple logins* = isolate
separate Claude/agent subscriptions per project. *Mobile* ✅ = app or mobile-first.

`;

const m = cell => MARK[(cell||{s:'no'}).s] || MARK.no;
const stars = n => n==null ? '—'
  : n>=1e6 ? (n/1e6).toFixed(1).replace(/\.0$/,'')+'M'
  : n>=1e4 ? Math.round(n/1e3)+'k'
  : n>=1e3 ? (n/1e3).toFixed(1).replace(/\.0$/,'')+'k' : ''+n;
const cols = ['#','Platform','★ Stars','Cost','Sub login','Self-hosted','GitHub Issues','Projects','PRs / push','One-click shell',
  'Multiple logins','Mobile','Agents / models','Bottom line (what users say)'];
let rows = `| ${cols.join(' | ')} |\n|${cols.map(()=>'---').join('|')}|\n`;
P.forEach((p, i) => {
  rows += `| ${i+1} | **[${esc(p.name)}](${p.url})** | ${stars(p.stars)} | ${cost(p.cost)} | ${m(p.sub)}<br><sub>${esc(p.sub.note)}</sub> | ${m(p.selfHosted)} | ${m(p.ghIssues)} | ${m(p.ghProjects)} | ${m(p.prs)} | ${m(p.shell)} | ${m(p.multi)} | ${m(p.mobile)}<br><sub>${esc(p.mobile.note)}</sub> | ${esc(p.agents)} | ${esc(p.verdict)} |\n`;
});

const footer = `
---

### How this stays current
The table is generated from the data in **[\`site/index.html\`](site/index.html)** (a single \`PLATFORMS\`
array). A weekly bot scans curated lists of new agent platforms, adds any that are missing, re-ranks,
and regenerates both the live site and this README — so they never drift.

**Suggest a platform:** [open an issue](https://github.com/jrdevelopr/ai-builders-toolkit/issues/new?title=Suggest%20a%20platform:%20).

<sub>Ratings are based on official docs/repos; “➖”/“🟡” are used instead of guessing. Projects = the platform's own
project/task board or PM-tool integration (Linear, Jira, GitHub Projects). Prices are list-price estimates and change often — verify before buying.
This is a personal, independent comparison, free to share.</sub>
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), header + rows + footer);
console.log(`README.md generated — ${P.length} platforms.`);
