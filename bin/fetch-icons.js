#!/usr/bin/env node
// One-shot: grab each platform's favicon (GitHub org avatar for repo-hosted, site favicon
// otherwise); generate a small SVG tile fallback when none is fetchable. Writes site/icons/*,
// patches each platform with an `icon` path. Run once, then delete.
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const ROOT=path.join(__dirname,'..'), ICONS=path.join(ROOT,'site','icons');
fs.mkdirSync(ICONS,{recursive:true});
const FILE=path.join(ROOT,'site','index.html');
let html=fs.readFileSync(FILE,'utf8');
const arr=JSON.parse(html.match(/const PLATFORMS=(\[[\s\S]*?\n\]);/)[1]);
// TOOLS may be a hand-written JS literal (unquoted keys) on first run, or JSON after we
// rewrite it — eval handles both. (Trusted local source file.)
const tarr=(()=>{const m=html.match(/const TOOLS=(\[[\s\S]*?\n\]);/);return m?Function('return ('+m[1]+')')():null;})();
// PROVIDERS: same tolerant eval-parse (JS literal or JSON) — kept local so the weekly
// discover cron never hotlinks a newly-added provider's icon.
const parr=(()=>{const m=html.match(/const PROVIDERS=(\[[\s\S]*?\n\]);/);return m?Function('return ('+m[1]+')')():null;})();

const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// map true content-type -> file extension. Naming the saved file by DETECTED mime
// (not by guessing from the URL) avoids serving e.g. an SVG as .ico, which browsers
// refuse to render (this was the Multica broken-icon bug).
const MIME_EXT={'image/png':'png','image/x-icon':'ico','image/vnd.microsoft.icon':'ico','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp','image/svg+xml':'svg'};
// Download to a temp file; on a valid image return its TRUE extension, else null.
function tryFetch(url,tmp){
  try{
    execSync(`curl -fsSL --max-time 18 -A "Mozilla/5.0" -o "${tmp}" "${url}"`,{stdio:'ignore'});
    const sz=fs.statSync(tmp).size;
    const mime=execSync(`file -b --mime-type "${tmp}"`,{encoding:'utf8'}).trim();
    if(sz>500 && MIME_EXT[mime]) return MIME_EXT[mime];   // >500b rejects tiny blank favicons
  }catch(e){}
  try{fs.unlinkSync(tmp);}catch(e){}
  return null;
}
function candidates(p){
  try{
    const u=new URL(p.url);
    if(u.hostname==='github.com'){
      const owner=u.pathname.split('/').filter(Boolean)[0];
      return [`https://github.com/${owner}.png?size=120`];
    }
    if(u.hostname.endsWith('.github.io')){            // GitHub Pages — use the owner's avatar
      const owner=u.hostname.split('.')[0];
      return [`https://github.com/${owner}.png?size=120`];
    }
    const d=u.hostname.replace(/^www\./,'');
    return [`https://${d}/favicon.ico`,`https://${d}/favicon.png`,
            `https://${d}/favicon.svg`,`https://icons.duckduckgo.com/ip3/${d}.ico`];
  }catch(e){ return []; }
}
// deterministic color from name
function hue(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h;}
function svgTile(name){
  const init=name.replace(/[^A-Za-z0-9]/g,'').slice(0,1).toUpperCase()||'?';
  const h=hue(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="hsl(${h} 62% 52%)"/><text x="16" y="22" text-anchor="middle" font-family="system-ui,Arial,sans-serif" font-size="16" font-weight="700" fill="#fff">${init}</text></svg>`;
}

let fetched=0, svg=0;
function processList(list,label){
  console.log(`\n[${label}]`);
  for(const p of list){
    const s=slug(p.name);
    if(p.icon && fs.existsSync(path.join(ROOT,'site',p.icon))){ console.log(`  ${p.name.padEnd(16)} -> keep ${p.icon}`); continue; } // don't clobber good/manual icons
    let saved=null;
    const tmp=path.join(ICONS,`.${s}.tmp`);
    for(const url of candidates(p)){
      const ext=tryFetch(url,tmp);                 // null, or the TRUE extension by mime
      if(ext){
        const out=path.join(ICONS,`${s}.${ext}`);
        fs.renameSync(tmp,out);
        saved=`icons/${s}.${ext}`; fetched++; break;
      }
    }
    if(!saved){
      fs.writeFileSync(path.join(ICONS,`${s}.svg`), svgTile(p.name));
      saved=`icons/${s}.svg`; svg++;
    }
    p.icon=saved;
    console.log(`  ${p.name.padEnd(16)} -> ${saved}`);
  }
}
processList(arr,'PLATFORMS');
if(tarr)processList(tarr,'TOOLS');
if(parr)processList(parr,'PROVIDERS');

const litP='[\n'+arr.map(o=>JSON.stringify(o)).join(',\n')+'\n]';
html=html.replace(/const PLATFORMS=\[[\s\S]*?\n\];/,'const PLATFORMS='+litP+';');
if(tarr){
  const litT='[\n'+tarr.map(o=>JSON.stringify(o)).join(',\n')+'\n]';
  html=html.replace(/const TOOLS=\[[\s\S]*?\n\];/,'const TOOLS='+litT+';');
}
if(parr){
  const litR='[\n'+parr.map(o=>JSON.stringify(o)).join(',\n')+'\n]';
  html=html.replace(/const PROVIDERS=\[[\s\S]*?\n\];/,'const PROVIDERS='+litR+';');
}
fs.writeFileSync(FILE,html);
console.log(`\nReal favicons: ${fetched} · SVG fallbacks: ${svg} · platforms ${arr.length}${tarr?` · tools ${tarr.length}`:''}${parr?` · providers ${parr.length}`:''}`);
