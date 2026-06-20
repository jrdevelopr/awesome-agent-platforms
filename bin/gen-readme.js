#!/usr/bin/env node
// Generate README.md (a static markdown comparison table) from the SAME PLATFORMS
// data that drives site/index.html — so GitHub shows the chart, always in sync.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// --- extract the PLATFORMS array by running the page's data script in a DOM stub ---
const html = fs.readFileSync(path.join(ROOT, 'site/index.html'), 'utf8');
const scriptBody = html.split('<script>').pop().split('</script>')[0]; // the big data+render script
const el = () => ({ set innerHTML(v){}, set textContent(v){}, classList:{add(){},remove(){}}, addEventListener(){} });
const documentStub = {
  documentElement: { getAttribute: () => null, setAttribute(){}, removeAttribute(){} },
  getElementById: el, querySelectorAll: () => []
};
const fn = new Function('document','window','navigator','location','localStorage',
  scriptBody + '\nreturn PLATFORMS;');
const P = fn(documentStub, {}, {}, { href:'' }, { getItem:()=>null, setItem(){} });

// --- helpers ---
const MARK = { yes:'✅', partial:'🟡', no:'➖' };
const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
const cost = c => c.t === 'paid' ? `💲 **Paid** <br><sub>${esc(c.price)}</sub>`
              : c.t === 'hybrid' ? `OSS + Cloud <br><sub>${esc(c.price)}</sub>`
              : `Free <br><sub>${esc(c.price)}</sub>`;

const header = `<!-- This file is AUTO-GENERATED from site/index.html by bin/gen-readme.js. Do not edit by hand. -->
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

`;

const cols = ['#','Platform','Cost','GitHub Issues','GH Projects','PRs / push','One-click shell',
  'Multiple logins','Mobile','Agents / models','Bottom line'];
let rows = `| ${cols.join(' | ')} |\n|${cols.map(()=>'---').join('|')}|\n`;
P.forEach((p, i) => {
  rows += `| ${i+1} | **[${esc(p.name)}](${p.url})** | ${cost(p.cost)} | ${MARK[p.ghIssues.s]} | ${MARK[p.ghProjects.s]} | ${MARK[p.prs.s]} | ${MARK[p.shell.s]} | ${MARK[p.multi.s]} | ${MARK[p.mobile.s]}<br><sub>${esc(p.mobile.note)}</sub> | ${esc(p.agents)} | ${esc(p.verdict)} |\n`;
});

const footer = `
---

### How this stays current
The table is generated from the data in **[\`site/index.html\`](site/index.html)** (a single \`PLATFORMS\`
array). A weekly bot scans curated lists of new agent platforms, adds any that are missing, re-ranks,
and regenerates both the live site and this README — so they never drift.

**Suggest a platform:** [open an issue](https://github.com/jrdevelopr/agents/issues/new?title=Suggest%20a%20platform:%20).

<sub>Ratings are based on official docs/repos; “➖”/“🟡” are used instead of guessing. GitHub Projects = GitHub's
boards, not a product's internal Kanban. Prices are list-price estimates and change often — verify before buying.
This is a personal, independent comparison, free to share.</sub>
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), header + rows + footer);
console.log(`README.md generated — ${P.length} platforms.`);
