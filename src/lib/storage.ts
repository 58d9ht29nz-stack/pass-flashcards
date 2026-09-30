import type {AppState} from '../types';
const KEY='pass-flashcards-mvp-v1';
export const emptyState:AppState={courses:[],cards:[],settings:{modePass:true,apiUrl:'',apiKey:''}};
export function loadState():AppState{try{const raw=localStorage.getItem(KEY);return raw?{...emptyState,...JSON.parse(raw)}:emptyState}catch{return emptyState}}
export function saveState(state:AppState){localStorage.setItem(KEY,JSON.stringify(state))}
export function uid(prefix='id'){return `${prefix}_${crypto.randomUUID()}`}
