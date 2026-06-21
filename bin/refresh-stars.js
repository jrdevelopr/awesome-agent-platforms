#!/usr/bin/env node
// Refresh GitHub stargazer counts for every repo-backed entry across all four data
// arrays in site/index.html (PLATFORMS, TOOLS, PROVIDERS, BLOCKS). Sorting on the site
// leans on stars, so repo-backed rows must show LIVE counts; closed-source SaaS with no
// repo legitimately keep stars:null.
//
// A repo is resolved from, in order:
//   1) an explicit  "repo":"owner/name"  field (use this when the entry's url is a
//      marketing homepage, e.g. Ollama -> ollama/ollama), or
//   2) the entry's github.com URL.
// Entries with neither are left exactly as-is (existing value preserved — never nulled).
//
// Uses the authenticated `gh` CLI (gh api) so it shares your GitHub rate limit (5000/hr).
// Re-runnable any time; the weekly discover cron can call it too.
//
//   node bin/refresh-stars.js            # refresh all
//
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const FILE = path.join(__dirname, '..', 'site', 'index.html');
let html = fs.readFileSync(FILE, 'utf8');

const getArr = k => { const m = html.match(new RegExp('const ' + k + '=(\\[[\\s\\S]*?\\n\\]);')); return m ? Function('return (' + m[1] + ')')() : null; };
const setArr = (k, a) => { const lit = '[\n' + a.map(o => JSON.stringify(o)).join(',\n') + '\n]'; html = html.replace(new RegExp('const ' + k + '=\\[[\\s\\S]*?\\n\\];'), 'const ' + k + '=' + lit + ';'); };

function repoOf(o) {
  if (o.repo) return o.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '').replace(/\.git$/, '');
  const m = (o.url || '').match(/github\.com\/([^\/]+\/[^\/#?]+)/);
  return m ? m[1].replace(/\.git$/, '') : null;
}
const cache = {};
function stars(repo) {
  if (repo in cache) return cache[repo];
  let v = null;
  try {
    const n = execSync(`gh api repos/${repo} --jq .stargazers_count`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (/^\d+$/.test(n)) v = parseInt(n, 10);
  } catch (e) {}
  cache[repo] = v;
  return v;
}

let updated = 0, kept = 0, noRepo = 0, dead = 0;
for (const k of ['PLATFORMS', 'TOOLS', 'PROVIDERS', 'BLOCKS']) {
  const a = getArr(k); if (!a) continue;
  console.log(`\n[${k}]`);
  for (const o of a) {
    const repo = repoOf(o);
    if (!repo) { noRepo++; continue; }
    const s = stars(repo);
    if (s == null) { console.log(`  ⚠ ${o.name.padEnd(24)} ${repo} -> no data (keep ${o.stars})`); dead++; continue; }
    if (o.stars !== s) {
      const delta = o.stars == null ? '(was null)' : (s - o.stars >= 0 ? '+' : '') + (s - o.stars);
      console.log(`  ${o.name.padEnd(24)} ${repo.padEnd(34)} ${String(o.stars).padStart(8)} => ${String(s).padStart(8)}  ${delta}`);
      o.stars = s; updated++;
    } else { kept++; }
  }
  setArr(k, a);
}
fs.writeFileSync(FILE, html);
console.log(`\n✓ Updated ${updated} · unchanged ${kept} · no-repo (kept as-is) ${noRepo} · repo 404/no-data ${dead}`);
