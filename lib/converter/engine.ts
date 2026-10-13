import { MIME } from './constants';
import { isHex, validateDimensions, verifyOutput } from './helpers';
import type { Result, Settings } from './types';
export async function convertOffscreen(file: Blob, settings: Settings): Promise<Result> {
  if (!isHex(settings.background)) throw new Error('Choose a valid background color.');
  let bitmap: ImageBitmap | undefined; let canvas: OffscreenCanvas | undefined;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const {width,height} = bitmap; validateDimensions(width,height);
    canvas = new OffscreenCanvas(width,height);
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Image canvas is unavailable. Try a smaller image.');
    if (settings.to === 'jpg') { ctx.fillStyle=settings.background; ctx.fillRect(0,0,width,height); }
    ctx.drawImage(bitmap,0,0);
    const blob = await canvas.convertToBlob({type:MIME[settings.to],quality:settings.quality});
    await verifyOutput(blob,settings.to); return {blob,width,height};
  } catch(error) {
    if (error instanceof DOMException) throw new Error('This image could not be decoded or encoded. It may be damaged or exceed your browser’s memory. Try a smaller image.');
    throw error;
  } finally { bitmap?.close(); if (canvas) { canvas.width=1; canvas.height=1; } }
}
export async function convertCanvas(file: Blob, settings: Settings): Promise<Result> {
  if (!isHex(settings.background)) throw new Error('Choose a valid background color.');
  const url=URL.createObjectURL(file), image=new Image(), canvas=document.createElement('canvas');
  try {
    image.src=url; await image.decode();
    const width=image.naturalWidth,height=image.naturalHeight; validateDimensions(width,height);
    canvas.width=width; canvas.height=height; const ctx=canvas.getContext('2d');
    if (!ctx) throw new Error('Your browser does not provide an image canvas. Try a different browser.');
    if(settings.to==='jpg') {ctx.fillStyle=settings.background;ctx.fillRect(0,0,width,height);}
    ctx.drawImage(image,0,0);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Encoding failed. Try a smaller image.')),MIME[settings.to],settings.quality));
    await verifyOutput(blob,settings.to); return {blob,width,height};
  } catch(error) { if(error instanceof DOMException) throw new Error('This image could not be opened. Choose a valid, smaller image.'); throw error; }
  finally {URL.revokeObjectURL(url);image.src='';canvas.width=1;canvas.height=1;}
}
