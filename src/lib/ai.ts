import type {CardType, Flashcard, Importance} from '../types';
import {uid} from './storage';

type Generated={term:string;importance:Importance;type:CardType;question:string;answer:string;tags:string[]};
const stop=new Set('avec dans pour une des les sur que qui est sont cette cet cette aux par plus comme entre leur leurs aussi donc ainsi après avant sous sans cette ces du de la le un et ou en au aux il elle ils elles être avoir faire peut peut-être très cette'.split(' '));
function clean(s:string){return s.replace(/\s+/g,' ').replace(/[•●▪]/g,' ').trim()}
function sentences(text:string){return text.split(/(?<=[.!?])\s+/).map(clean).filter(s=>s.length>45)}
function terms(text:string){const words=text.replace(/[^\p{L}\p{N}\- ]/gu,' ').split(/\s+/);const freq=new Map<string,number>();for(const w0 of words){const w=w0.toLowerCase();if(w.length<7||stop.has(w)||/^\d+$/.test(w))continue;freq.set(w,(freq.get(w)||0)+1)}return [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,35).map(x=>x[0])}
function findDefinition(term:string,text:string){const low=text.toLowerCase(), idx=low.indexOf(term.toLowerCase());if(idx<0)return null;const window=text.slice(Math.max(0,idx-180),Math.min(text.length,idx+420));const m=window.match(new RegExp(`${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[^.!?]{0,280}(?:est|désigne|correspond|se définit|enzyme|molécule|ensemble|processus)[^.!?]*[.!?]`,'i'));return m?clean(m[0]):null}
export function demoGenerate(text:string,count:number,modePass=true):Generated[]{
 const ts=terms(text);const ss=sentences(text);const result:Generated[]=[];
 for(const term of ts){if(result.length>=count)break;const def=findDefinition(term,text);if(def){result.push({term,importance:modePass?3:2,type:'definition',question:`Qu’est-ce que ${term} ?`,answer:def,tags:[term,'définition',modePass?'QCM':'cours']})}}
 for(const s of ss){if(result.length>=count)break;const num=s.match(/\b\d+(?:[.,]\d+)?\s?(?:%|mmHg|mol|mmol|mg|g|kg|mL|L|°C|kPa|Pa)\b/);if(num){const key=num[0];result.push({term:key,importance:3,type:'qa',question:`Quelle valeur importante est donnée dans le cours pour : ${clean(s.slice(0,90))} ?`,answer:s,tags:['valeur','piège QCM']})}}
 for(const s of ss){if(result.length>=count)break;if(/différence|contrairement|alors que|tandis que|opposé|versus/i.test(s)){result.push({term:'Comparaison',importance:modePass?3:2,type:'comparison',question:`Quelle distinction retenir ?`,answer:s,tags:['comparaison','QCM']})}}
 return dedupe(result).slice(0,count)
}
function dedupe(cards:Generated[]){const seen=new Set<string>();return cards.filter(c=>{const k=c.question.toLowerCase().replace(/[^a-z0-9àâçéèêëîïôûùüÿœ ]/gi,'').slice(0,100);if(seen.has(k))return false;seen.add(k);return true})}
export function toFlashcards(items:Generated[],courseId:string):Flashcard[]{const now=Date.now();return items.map(x=>({id:uid('card'),courseId,...x,difficulty:x.importance===3?'hard':x.importance===2?'medium':'easy',nextReview:now,interval:0,repetitions:0,createdAt:now}))}
export async function generateWithApi(text:string,count:number,modePass:boolean,apiUrl:string,apiKey:string){
 if(!apiUrl)return demoGenerate(text,count,modePass);
 const prompt=`Tu es un expert de la pédagogie PASS. Analyse le cours ci-dessous. Retourne UNIQUEMENT un JSON array valide. Chaque objet: term, importance (1-3), type (definition|qa|truefalse|fill|comparison|formula|association|classification|identification|understanding), question, answer, tags. Une carte = une information principale. Fidèle au cours, pas d'invention. Mode PASS=${modePass}. Maximum ${count}.\nCOURS:\n${text}`;
 const r=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json',...(apiKey?{'Authorization':`Bearer ${apiKey}`}:{})},body:JSON.stringify({prompt})});if(!r.ok)throw new Error(`API IA: ${r.status}`);const data=await r.json();const raw=Array.isArray(data)?data:data.cards||data.output||data.result;const items=typeof raw==='string'?JSON.parse(raw):raw;if(!Array.isArray(items))throw new Error('Réponse IA invalide');return items.slice(0,count).map((x:any)=>({term:String(x.term||''),importance:(Number(x.importance)||2) as Importance,type:x.type||'qa',question:String(x.question||''),answer:String(x.answer||''),tags:Array.isArray(x.tags)?x.tags.map(String):[]}));
}
