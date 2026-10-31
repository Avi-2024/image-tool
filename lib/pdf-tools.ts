import { PDFDocument } from 'pdf-lib';
import { validateInput, validateDimensions } from './converter/helpers';
import type { Format } from './converter/types';

export const PDF_LIMITS = { imageCount: 20, imageTotalBytes: 75 * 1024 * 1024, pdfBytes: 25 * 1024 * 1024, pages: 50, outputBytes: 100 * 1024 * 1024, zipBytes: 60 * 1024 * 1024 };

export async function checkPdf(file: File) {
  if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) throw new Error('Choose a genuine .pdf file.');
  if (!file.size || file.size > PDF_LIMITS.pdfBytes) throw new Error('Choose a PDF between 1 byte and 25 MB.');
  const head = new TextDecoder().decode(await file.slice(0, 8).arrayBuffer());
  if (!/^%PDF-[12]\./.test(head)) throw new Error('This file does not have a valid PDF header.');
}

export function pageRange(first: number, last: number, total: number) {
  if (!Number.isInteger(first) || !Number.isInteger(last) || first < 1 || last < first || last > total || last - first + 1 > PDF_LIMITS.pages) {
    throw new Error(`Choose a valid range of up to ${PDF_LIMITS.pages} pages.`);
  }
  return Array.from({length:last-first+1}, (_, index) => first+index);
}

export async function makeImagePdf(files: File[], onProgress?: (completed: number) => void): Promise<Blob> {
  if (!files.length || files.length > PDF_LIMITS.imageCount || files.reduce((sum, file) => sum+file.size, 0) > PDF_LIMITS.imageTotalBytes) {
    throw new Error('Choose up to 20 images, with a combined size under 75 MB.');
  }
  const pdf = await PDFDocument.create();
  for (const [index, file] of files.entries()) {
    const format: Format = await validateInput(file, 'any');
    let bytes: Uint8Array;
    let embeddedFormat: 'jpg' | 'png' = format === 'jpg' ? 'jpg' : 'png';
    if (format === 'webp') {
      // pdf-lib embeds JPEG/PNG. Decode WebP locally and preserve transparency as PNG.
      const url=URL.createObjectURL(file),image=new Image();
      try {
        image.src=url;await image.decode();
        validateDimensions(image.naturalWidth, image.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas is unavailable in this browser.');
        context.drawImage(image, 0, 0);
        const png = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        canvas.width = 0; canvas.height = 0;
        if (!png || png.type !== 'image/png') throw new Error('WebP could not be prepared for PDF.');
        bytes = new Uint8Array(await png.arrayBuffer());
      } finally { image.src='';URL.revokeObjectURL(url); }
      embeddedFormat = 'png';
    } else bytes = new Uint8Array(await file.arrayBuffer());
    const image = embeddedFormat === 'jpg' ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes);
    validateDimensions(image.width, image.height);
    const landscape = image.width > image.height;
    const [width, height] = landscape ? [841.89, 595.28] : [595.28, 841.89];
    const page = pdf.addPage([width, height]);
    const scale = Math.min((width-48)/image.width, (height-48)/image.height);
    const drawnWidth = image.width*scale, drawnHeight = image.height*scale;
    page.drawImage(image, {x:(width-drawnWidth)/2,y:(height-drawnHeight)/2,width:drawnWidth,height:drawnHeight});
    onProgress?.(index+1);
  }
  const bytes = await pdf.save();
  if (bytes.byteLength > PDF_LIMITS.outputBytes) throw new Error('The PDF exceeds the 100 MB download limit. Try fewer images.');
  return new Blob([new Uint8Array(bytes)], {type:'application/pdf'});
}
