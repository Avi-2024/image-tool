// @vitest-environment node
import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {PDFDocument} from 'pdf-lib';
import {checkPdf,makeImagePdf,pageRange} from '@/lib/pdf-tools';

const image=(name:string,type:string)=>new File([readFileSync(`tests/fixtures/${name}`)],name,{type});
describe('PDF tools with real image bytes',()=>{
 it('creates a two-page PDF from genuine JPEG and PNG, preserving order and A4 orientation',async()=>{
  const output=await makeImagePdf([image('photo.jpg','image/jpeg'),image('alpha.png','image/png')]);
  expect(output.type).toBe('application/pdf');
  expect(new TextDecoder().decode(await output.slice(0,5).arrayBuffer())).toBe('%PDF-');
  const pdf=await PDFDocument.load(await output.arrayBuffer());
  expect(pdf.getPageCount()).toBe(2);
  for(const page of pdf.getPages())expect(Math.round(Math.max(page.getWidth(),page.getHeight()))).toBe(842);
 });
 it('rejects renamed or corrupt images instead of creating a misleading PDF',async()=>{
  await expect(makeImagePdf([image('corrupt.png','image/png')])).rejects.toThrow();
  await expect(makeImagePdf([image('photo.jpg','image/png')])).rejects.toThrow();
 });
 it('rejects fake PDF headers and invalid ranges',async()=>{
  await expect(checkPdf(new File([new TextEncoder().encode('not a pdf')],'fake.pdf',{type:'application/pdf'}))).rejects.toThrow('valid PDF header');
  expect(pageRange(2,4,10)).toEqual([2,3,4]);
  expect(()=>pageRange(1,51,51)).toThrow();
  expect(()=>pageRange(4,2,10)).toThrow();
 });
 it('opens the real two-page PDF fixture with the page renderer parser',async()=>{
  const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const {createCanvas}=await import('@napi-rs/canvas');
  const task=getDocument({data:new Uint8Array(readFileSync('tests/fixtures/two-pages.pdf'))});
  try{
   const document=await task.promise;expect(document.numPages).toBe(2);
   const page=await document.getPage(1),viewport=page.getViewport({scale:1});expect(viewport.width).toBe(300);
   const canvas=createCanvas(300,300);
   await page.render({canvas:canvas as unknown as HTMLCanvasElement,viewport}).promise;
   expect([...canvas.toBuffer('image/png').subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
  }
  finally{await task.destroy();}
 });
});
