import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc=workerSrc;
export async function extractPdfText(file:File){const data=new Uint8Array(await file.arrayBuffer());const pdf=await pdfjsLib.getDocument({data}).promise;let out='';for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const content=await page.getTextContent();out+=`\n\n--- Page ${i} ---\n`+content.items.map((x:any)=>x.str||'').join(' ')}return out.trim()}
