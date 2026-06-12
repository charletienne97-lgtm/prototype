async function loadData(){
  const res = await fetch('data/characters.json');
  return res.json();
}

function hexToHsl(hex){
  hex = hex.replace('#','');
  const r = parseInt(hex.substring(0,2),16)/255;
  const g = parseInt(hex.substring(2,4),16)/255;
  const b = parseInt(hex.substring(4,6),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0,s=0,l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s = l>0.5? d/(2-max-min): d/(max+min);
    switch(max){
      case r: h=(g-b)/d + (g<b?6:0); break;
      case g: h=(b-r)/d + 2; break;
      case b: h=(r-g)/d + 4; break;
    }
    h/=6;
  }
  return {h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100)};
}

function hslToCss(h,s,l){ return `hsl(${h} ${s}% ${l}%)`; }

function circHueDiff(a,b){ let d=Math.abs(a-b); return Math.min(d,360-d); }

function scoreMatch(targetHSL, gotHSL){
  const hueErr = circHueDiff(targetHSL.h, gotHSL.h)/180; // 0..1
  const satErr = Math.abs(targetHSL.s - gotHSL.s)/100;
  const lightErr = Math.abs(targetHSL.l - gotHSL.l)/100;
  const weighted = 0.5*hueErr + 0.3*satErr + 0.2*lightErr;
  const score = Math.max(0, Math.round(10*(1-weighted)));
  return {score, weighted};
}

function pickRandom(arr,n){
  const copy = arr.slice();
  const out=[]; while(out.length<n && copy.length){
    const i=Math.floor(Math.random()*copy.length); out.push(copy.splice(i,1)[0]);
  }
  return out;
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const data = await loadData();
  const pool = data.characters;
  const gameChars = pickRandom(pool,5);
  let idx=0, totalScore=0;

  const img = document.getElementById('char-image');
  const overlay = document.getElementById('overlay');
  const charCaption = document.getElementById('char-caption');
  const hue = document.getElementById('hue');
  const sat = document.getElementById('sat');
  const con = document.getElementById('con');
  const swatch = document.getElementById('swatch');
  const hueVal = document.getElementById('hueVal');
  const satVal = document.getElementById('satVal');
  const conVal = document.getElementById('conVal');
  const submit = document.getElementById('submit');
  const scoreDiv = document.getElementById('score');
  const status = document.getElementById('status');

  function updateSwatch(){
    const h=+hue.value, s=+sat.value, c=+con.value;
    const baseL=50; const l = Math.min(100, Math.max(0, Math.round(baseL*(1 + c/100))));
    swatch.style.background = hslToCss(h,s,l);
    hueVal.textContent = h; satVal.textContent = s + '%'; conVal.textContent = c;
  }

  hue.addEventListener('input', updateSwatch);
  sat.addEventListener('input', updateSwatch);
  con.addEventListener('input', updateSwatch);

  function showCharacter(i){
    const ch = gameChars[i];
    img.src = ch.image.url;
    img.alt = ch.name;
    charCaption.textContent = `${ch.show} — ${ch.name}`;
    // pick random region for this character
    const region = ch.regions[Math.floor(Math.random()*ch.regions.length)];
    overlay.dataset.targetColor = region.color;
    overlay.dataset.regionName = region.name;
    overlay.style.left = region.x + '%'; overlay.style.top = region.y + '%';
    overlay.style.width = region.w + '%'; overlay.style.height = region.h + '%';
    overlay.style.background = 'rgba(128,128,128,0.7)';
    overlay.textContent = region.name;
    scoreDiv.textContent = `Score: — / 10  (${i+1}/5)`;
    status.textContent = `${ch.show} — ${ch.name} — greyed: ${region.name}`;
  }

  submit.addEventListener('click', ()=>{
    const ch = gameChars[idx];
    const targetHex = overlay.dataset.targetColor;
    const targetHSL = hexToHsl(targetHex);
    const h = +hue.value, s = +sat.value; const baseL=50; const l = Math.min(100, Math.max(0, Math.round(baseL*(1 + (+con.value)/100))));
    const got = {h,s,l};
    const res = scoreMatch(targetHSL, got);
    totalScore += res.score;
    scoreDiv.textContent = `Score: ${res.score} / 10  (${idx+1}/5)`;
    overlay.style.background = 'rgba(128,128,128,0.4)';
    idx++;
    if(idx<gameChars.length){
      setTimeout(()=>{ overlay.style.background='rgba(128,128,128,0.7)'; showCharacter(idx); }, 900);
    } else {
      setTimeout(()=>{
        status.textContent = `Game complete — total: ${totalScore} / ${gameChars.length*10}`;
        scoreDiv.textContent = `Final: ${totalScore} / ${gameChars.length*10}`;
      },900);
    }
  });

  updateSwatch(); showCharacter(0);
});
