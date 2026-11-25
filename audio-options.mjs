// Audio alternatives use the base name, then -1, -2, etc.
export async function discoverAudio(id, fetcher=fetch, limit=10){
 const candidates=Array.from({length:limit},(_,i)=>i?`${id}-${i}`:id);
 return (await Promise.all(candidates.map(async key=>{
  const formats=await Promise.all(['ogg','mp3'].map(async ext=>{
   const url=`son/${key}.${ext}`;
   try{const r=await fetcher(url,{method:'HEAD'});const type=(r.headers.get('content-type')||'').toLowerCase();return r.ok&&(type.startsWith('audio/')||type.includes('octet-stream')||type.includes('application/ogg'))?ext:null;}catch{return null;}
  }));
  return formats.some(Boolean)?{key,formats:formats.filter(Boolean)}:null;
 }))).filter(Boolean);
}
export function nextAudio(options,heard){
 const pending=options.filter(o=>!heard.has(o.key));
 if(options.length===1)return options[0];
 if(pending.length===1)return pending[0];
 return null;
}
