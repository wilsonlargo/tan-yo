import {discoverMedia,nextMedia,choicePrompt} from './media-options.mjs';
import {photos,loadPhotos,detectPhoto} from './photos.js';
import {detect} from './markers.js';
import {scenes} from './content.js';

const app=document.querySelector('#app'),el=s=>app.querySelector(s);
let stream,raf,epoch=0,refs=[];
let loading=loadPhotos().then(r=>refs=r).catch(e=>{console.error(e);return []});
function stop(){epoch++;cancelAnimationFrame(raf);stream?.getTracks().forEach(t=>t.stop());stream=null}
let recognized=null;const go=h=>{recognized=h;location.hash=h};

const mediaPanel=document.querySelector('#media-panel');
const mediaChoiceTitle=document.querySelector('#media-choice-title');
const mediaChoices=document.querySelector('#media-choices');
const mediaContainer=document.querySelector('#media-container');
const mediaStatus=document.querySelector('#media-status');
const mediaReplay=document.querySelector('#media-replay');

let mediaEpoch=0, activeMedia=null, currentOptions=[], currentPlayer=null;
const explored=new Set();
try{for(const key of JSON.parse(localStorage.getItem('tan-yo-explored-v2')||'[]'))explored.add(key)}catch{}

function saveExplored(){try{localStorage.setItem('tan-yo-explored-v2',JSON.stringify([...explored]))}catch{}}
function resetMedia(){
  mediaEpoch++;
  activeMedia=null;
  currentOptions=[];
  currentPlayer?.pause?.();
  currentPlayer=null;
  mediaChoices.replaceChildren();
  mediaContainer.replaceChildren();
  mediaChoiceTitle.hidden=true;
  mediaReplay.hidden=true;
  mediaPanel.hidden=true;
  mediaStatus.textContent='';
}
function friendlyLabel(option){
  const sameKind=currentOptions.filter(o=>o.kind===option.kind);
  const index=sameKind.findIndex(o=>o.uid===option.uid)+1;
  if(option.kind==='video') return sameKind.length>1?`Video ${index}`:'Ver video';
  return sameKind.length>1?`Audio ${index}`:'Escuchar audio';
}
function renderChoices(){
  mediaChoices.replaceChildren();
  mediaChoiceTitle.hidden=currentOptions.length<2;
  mediaChoiceTitle.textContent=choicePrompt(currentOptions);
  for(const option of currentOptions){
    if(currentOptions.length<2) break;
    const b=document.createElement('button');
    b.className='secondary';
    const state=explored.has(option.uid)?(option.kind==='video'?' · Visto':' · Escuchado'):'';
    b.textContent=`${friendlyLabel(option)}${state}`;
    b.setAttribute('aria-pressed',String(activeMedia===option.uid));
    b.onclick=()=>playMedia(option);
    mediaChoices.append(b);
  }
}
function bindPlayerEvents(player, option){
  player.addEventListener('playing',()=>mediaStatus.textContent='');
  player.addEventListener('error',()=>{
    if(!mediaPanel.hidden) mediaStatus.textContent=option.kind==='video'
      ? 'Video no disponible o incompatible con este navegador.'
      : 'Audio no disponible o incompatible con este navegador.';
  },{once:true});
  player.addEventListener('ended',()=>{
    explored.add(option.uid);
    saveExplored();
    renderChoices();
    const pending=currentOptions.some(o=>!explored.has(o.uid));
    mediaStatus.textContent=pending
      ? (currentOptions.some(o=>o.kind==='video')?'Puedes abrir otro contenido o leer otra imagen.':'Puedes escuchar otro audio o leer otra imagen.')
      : '';
  },{once:true});
}
async function playPhoto(p){
  const token=++mediaEpoch;
  resetMedia();
  mediaPanel.hidden=false;
  mediaStatus.textContent='Buscando contenido…';
  const options=await discoverMedia(p.id);
  if(token!==mediaEpoch) return;
  currentOptions=options;
  if(!options.length){
    mediaStatus.textContent='No hay contenido disponible para esta imagen.';
    return;
  }
  renderChoices();
  const next=nextMedia(options, explored);
  if(next) playMedia(next);
  else mediaStatus.textContent=choicePrompt(options);
}
async function playMedia(option){
  const token=++mediaEpoch;
  activeMedia=option.uid;
  mediaPanel.hidden=false;
  mediaContainer.replaceChildren();
  mediaStatus.textContent='';
  renderChoices();

  const player=document.createElement(option.kind);
  player.controls=true;
  player.playsInline=true;
  player.preload='metadata';
  if(option.kind==='video') player.className='media video-player';
  else player.className='media audio-player';

  const preferred=[...option.formats].sort((a,b)=>Number(!player.canPlayType(mimeFor(a,option.kind)))-Number(!player.canPlayType(mimeFor(b,option.kind))));
  for(const ext of preferred){
    const source=document.createElement('source');
    source.src=`son/${option.key}.${ext}`;
    source.type=mimeFor(ext, option.kind);
    player.append(source);
  }
  mediaContainer.append(player);
  currentPlayer=player;
  bindPlayerEvents(player, option);

  mediaReplay.hidden=false;
  mediaReplay.textContent=option.kind==='video'?'Volver a ver':'Volver a escuchar';

  try{
    player.load();
    await player.play();
  }catch(e){
    if(token!==mediaEpoch) return;
    mediaStatus.textContent=e.name==='NotAllowedError'
      ? (option.kind==='video'?'Pulsa reproducir para ver el video.':'Pulsa reproducir para escuchar.')
      : (option.kind==='video'?'No se pudo iniciar el video. Comprueba el archivo o pulsa reproducir.':'No se pudo iniciar el audio. Comprueba el archivo o pulsa reproducir.');
  }
}
function mimeFor(ext, kind){
  if(kind==='video') return ext==='webm'?'video/webm':'video/mp4';
  if(ext==='ogg') return 'audio/ogg';
  if(ext==='wav') return 'audio/wav';
  if(ext==='m4a') return 'audio/mp4';
  return 'audio/mpeg';
}
mediaReplay.addEventListener('click',()=>{if(!currentPlayer)return;currentPlayer.currentTime=0;currentPlayer.play().catch(()=>{mediaStatus.textContent='No se pudo reproducir el contenido.';});});

// Prepare media playback during the same user gesture to help mobile autoplay policies.
document.addEventListener('click',e=>{
  if(!e.target.closest('a[href="#camara"]')) return;
  resetMedia();
  const warmup=document.createElement('audio');
  warmup.src='data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';
  warmup.play().catch(()=>{});
},true);

function home(){app.innerHTML='<section class="hero"><div class="eyebrow">Una experiencia entre dos mundos</div><h1>Más allá de<br>la imagen.</h1><p>Enfoca una fotografía impresa del televisor y descubre lo que guarda.</p><div class="actions"><a class="button" href="#camara">Leer imagen</a></div></section>'}
async function camera(){
  app.innerHTML='<h2>Encuentra una imagen</h2><div class="screen"><video playsinline muted autoplay></video><div class="frame"></div></div><p role="status">Solicitando cámara…</p><div class="actions"><button class="secondary" id="retry">Reintentar</button><label class="button secondary">Leer desde archivo<input type="file" accept="image/*" hidden></label><a class="button secondary" href="#inicio">Volver</a></div>';
  let token=epoch,v=el('video'),status=el('[role=status]'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  function fromFilename(name){
    const base=(name||'').toLowerCase().replace(/\.[^.]+$/,'');
    return photos.find(p=>p.id===base||base.startsWith(`${p.id}-`)) || null;
  }
  function scan(img,w,h){
    let scale=Math.min(1,640/Math.max(w,h));
    canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    let d=ctx.getImageData(0,0,canvas.width,canvas.height);
    let p=detectPhoto(d,refs);
    if(p) return {route:`foto/${p.id}`};
    let r=detect(d);
    return r?{route:`escena/${r.id}`}:null;
  }
  el('#retry').onclick=()=>{stop();camera()};
  el('input').onchange=async e=>{
    try{
      await loading;
      const file=e.target.files?.[0];
      if(!file) return;
      let img=await createImageBitmap(file);
      let r=scan(img,img.width,img.height);
      img.close();
      if(token!==epoch) return;
      if(!r){
        const named=fromFilename(file.name);
        if(named) r={route:`foto/${named.id}`};
      }
      if(r) go(r.route);
      else status.textContent='No se reconoció la imagen. Prueba una foto frontal y bien iluminada.';
    }catch{status.textContent='No se pudo abrir la foto.'}
  };
  try{
    let s=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
    if(token!==epoch){s.getTracks().forEach(t=>t.stop());return}
    stream=s;v.srcObject=s;await v.play();if(token!==epoch)return;
    await loading;if(token!==epoch)return;
    status.textContent=refs.length?'Enfoca la fotografía completa, centrada y de frente, con buena luz.':'No se pudieron cargar las referencias. Reintenta o recarga la página.';
    let last=0,prev='',count=0;
    function tick(t){
      if(token!==epoch)return;
      if(t-last>850&&v.videoWidth){
        last=t;
        let r=scan(v,v.videoWidth,v.videoHeight);
        if(r){count=r.route===prev?count+1:1;prev=r.route;if(count>=2){go(r.route);return}}
        else{count=0;prev=''}
      }
      raf=requestAnimationFrame(tick)
    }
    raf=requestAnimationFrame(tick)
  }catch{
    if(token===epoch) status.textContent='No se pudo abrir la cámara. Revisa permisos y usa HTTPS o localhost. También puedes leer desde un archivo.'
  }
}
function experience(i){let s=scenes[i];if(!s)return home();app.innerHTML=`<div class="eyebrow">TY-00${i+1}</div><h1></h1><p class="desc"></p><section class="experience"></section><div class="actions"><a class="button" href="#camara">Leer otra imagen</a><a class="button secondary" href="#inicio">Inicio</a></div>`;el('h1').textContent=s.title;el('.desc').textContent=s.description;let c=el('.experience');if(['audio','video'].includes(s.type)){let m=document.createElement(s.type);m.controls=true;m.src=s.src;m.className='media';m.playsInline=true;c.append(m);let p=document.createElement('p');p.textContent='Pulsa reproducir para iniciar.';c.append(p)}else if(s.type==='animation'){c.innerHTML='<button class="orb" aria-label="Cambiar colores"></button><p>Toca la figura.</p>';c.querySelector('button').onclick=e=>e.currentTarget.classList.toggle('alt')}else if(s.type==='question'){let p=document.createElement('p');p.setAttribute('role','status');for(let option of s.options){let b=document.createElement('button');b.className='secondary';b.style.margin='5px';b.textContent=option;b.onclick=()=>p.textContent='Elegiste: '+option;c.append(b)}c.append(p)}else if(s.type==='reveal'){let b=document.createElement('button'),p=document.createElement('p');b.textContent='Revelar';b.onclick=()=>{p.textContent=s.message;b.disabled=true};c.append(b,p)}else if(s.type==='link'){let a=document.createElement('a');a.className='button';a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Abrir enlace de ejemplo';c.append(a)}}
function photo(id){let p=photos.find(x=>x.id===id);if(!p)return home();app.innerHTML='<div class="eyebrow">Imagen reconocida</div><h1></h1><div class="actions"><a class="button" href="#camara">Leer otra imagen</a><a class="button secondary" href="#inicio">Inicio</a></div>';el('h1').textContent=p.title;playPhoto(p);}
function route(){stop();let h=location.hash.slice(1);if(h!=='camara'&&!(h===recognized&&h.startsWith('foto/')))resetMedia();else mediaPanel.hidden=true;if(h==='camara'){recognized=null;camera()}else if(h===recognized&&h.startsWith('foto/'))photo(h.split('/')[1]);else if(h===recognized&&h.startsWith('escena/'))experience(Number(h.split('/')[1]));else{recognized=null;home()};scrollTo(0,0)}
addEventListener('hashchange',route);addEventListener('pagehide',()=>{stop();resetMedia()});route();
