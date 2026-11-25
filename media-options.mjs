const AUDIO_EXTS=['ogg','mp3','wav','m4a'];
const VIDEO_EXTS=['mp4','webm'];

export async function discoverMedia(id, fetcher=fetch, limit=10){
  const candidates=Array.from({length:limit},(_,i)=>i?`${id}-${i}`:id);
  const items=(await Promise.all(candidates.map(key=>probeKey(key,fetcher)))).flat().filter(Boolean);
  if(id==='baile') {
    return [...items.filter(o=>!(o.key===id && o.kind==='video')), {uid:'baile:youtube:mQuUApUJyvk',key:id,kind:'video',youtubeId:'mQuUApUJyvk',url:'https://youtube.com/shorts/mQuUApUJyvk?si=JZxn3ozsIv6ynN3T'}];
  }
  return items;
}

async function probeKey(key, fetcher){
  const [audioFormats,videoFormats]=await Promise.all([
    probeFormats(key,AUDIO_EXTS,fetcher,'audio'),
    probeFormats(key,VIDEO_EXTS,fetcher,'video')
  ]);
  const found=[];
  if(audioFormats.length){
    found.push({uid:`${key}:audio`,key,kind:'audio',formats:audioFormats});
  }
  if(videoFormats.length){
    found.push({uid:`${key}:video`,key,kind:'video',formats:videoFormats});
  }
  return found;
}

async function probeFormats(key, exts, fetcher, kind){
  const results=await Promise.all(exts.map(async ext=>{
    const url=`son/${key}.${ext}`;
    try{
      const r=await fetcher(url,{method:'HEAD'});
      const type=(r.headers.get('content-type')||'').toLowerCase();
      if(!r.ok)return null;
      const looksRight=kind==='audio'
        ? (type.startsWith('audio/') || type.includes('application/ogg') || type.includes('octet-stream'))
        : (type.startsWith('video/') || type.includes('octet-stream'));
      return looksRight?ext:null;
    }catch{
      return null;
    }
  }));
  return results.filter(Boolean);
}

export function nextMedia(options, explored){
  const pending=options.filter(o=>!explored.has(o.uid));
  if(options.length===1)return options[0];
  if(pending.length===1)return pending[0];
  return null;
}

export function choicePrompt(options){
  const hasAudio=options.some(o=>o.kind==='audio');
  const hasVideo=options.some(o=>o.kind==='video');
  if(hasAudio && hasVideo) return '¿Qué quieres explorar?';
  if(hasVideo) return '¿Cuál quieres ver?';
  return '¿Cuál quieres escuchar?';
}
