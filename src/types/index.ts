export type CardType='definition'|'qa'|'truefalse'|'fill'|'comparison'|'formula'|'association'|'classification'|'identification'|'understanding';
export type Importance=1|2|3;
export type Rating='again'|'hard'|'good'|'easy';
export interface Course{id:string;title:string;subject:string;createdAt:number;documents:DocumentItem[]}
export interface DocumentItem{id:string;name:string;text:string;type:'pdf'|'text'|'image'|'manual';createdAt:number}
export interface Flashcard{id:string;courseId:string;term:string;importance:Importance;type:CardType;question:string;answer:string;tags:string[];difficulty:'easy'|'medium'|'hard';sourceDocument?:string;nextReview:number;interval:number;repetitions:number;lastRating?:Rating;createdAt:number}
export interface AppState{courses:Course[];cards:Flashcard[];settings:{modePass:boolean;apiUrl:string;apiKey:string}}
