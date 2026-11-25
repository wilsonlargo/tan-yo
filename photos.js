import {features,match} from './features.mjs';
export const photos=['gordo','necho','juan','ceci','xiomy','ado','tati','baile','moda','comida'].map(id=>({id,title:id[0].toUpperCase()+id.slice(1)}));
export async function loadPhotos(){let r=await fetch('./references.json');if(!r.ok)throw Error('Referencias no disponibles');return r.json()}
export function detectPhoto(d,refs){if(!refs.length)return null;let {width:w,height:h,data}=d;let gray=new Uint8Array(w*h);for(let i=0;i<gray.length;i++)gray[i]=.299*data[i*4]+.587*data[i*4+1]+.114*data[i*4+2];let scores=match(features(gray,w,h),refs),[a,b]=scores;return a&&a.score>=18&&a.score>=((b?.score||0)+7)?a:null}
