import type { Format } from './types';
import { LIMITS, MIME } from './constants';
export function uniqueId() { return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16).padStart(8,'0')).join(''); }
export function normalizeFormat(value: string): Format | undefined {
  const normalized = value.toLowerCase().replace('image/', '');
  return normalized === 'jpeg' || normalized === 'jpg' ? 'jpg' : normalized === 'png' || normalized === 'webp' ? normalized : undefined;
}
export function signature(bytes: Uint8Array): Format | undefined {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
  if ([137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) return 'png';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP') return 'webp';
}
export function validateDimensions(width: number, height: number) {
  if (width < 1 || height < 1 || width > LIMITS.dimension || height > LIMITS.dimension || width * height > LIMITS.pixels) throw new Error('This image is too large to process safely. Use an image under 40 megapixels and 16,384 px per side.');
}
export function isHex(value: string) { return /^#[0-9a-f]{6}$/i.test(value); }
export function size(bytes: number) { return bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`; }
export function difference(original: number, converted: number) {
  const percent = (original - converted) / original * 100;
  return Math.abs(percent) < 0.05 ? 'Same file size' : `${Math.abs(percent).toFixed(1)}% ${percent > 0 ? 'smaller' : 'larger'}`;
}
export function outputNames(names: string[], format: Format) {
  const used = new Set<string>();
  return names.map(name => {
    const stem = name.replace(/\.[^.]*$/, '').replace(/[\x00-\x1f\x7f/\\:*?"<>|]/g, '-').replace(/^\.+/, '').trim().slice(0,120) || 'image';
    let candidate = `${stem}.${format}`, n = 0;
    while (used.has(candidate.toLowerCase())) candidate = `${stem}-${++n}.${format}`;
    used.add(candidate.toLowerCase()); return candidate;
  });
}
export async function validateInput(file: File, expected: Format | 'any') {
  if (file.size === 0) throw new Error('This file is empty. Choose another image.');
  if (file.size > LIMITS.bytes) throw new Error('This file exceeds 25 MB. Choose a smaller image.');
  const head = new Uint8Array(await file.slice(0,32).arrayBuffer());
  const source = signature(head);
  if (!source) throw new Error('Unsupported file. Choose a JPG, PNG or WebP image.');
  const extension = normalizeFormat(file.name.split('.').pop() || '');
  if (!extension || extension !== source || (file.type && file.type !== MIME[source])) throw new Error('The image contents do not match its filename or type. Export a genuine JPG, PNG or WebP file.');
  if (expected !== 'any' && source !== expected) throw new Error(`This tool accepts ${expected.toUpperCase()} files. Choose the matching converter for this image.`);
  if (source === 'webp' && String.fromCharCode(...head.slice(12,16)) === 'VP8X' && (head[20] & 2)) throw new Error('Animated WebP is not supported. Export a still image first.');
  if (source === 'jpg') {
    const bytes = new Uint8Array(await file.arrayBuffer()), view = new DataView(bytes.buffer);
    let at = 2, found = false;
    while (at + 4 <= bytes.length) {
      if (bytes[at++] !== 255) break;
      while (bytes[at] === 255) at++;
      const marker = bytes[at++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker >= 0xd0 && marker <= 0xd8) continue;
      if (at + 2 > bytes.length) break;
      const length = view.getUint16(at);
      if (length < 2 || at + length > bytes.length) break;
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        if (length < 8) break;
        validateDimensions(view.getUint16(at + 5), view.getUint16(at + 3)); found = true; break;
      }
      at += length;
    }
    if (!found) throw new Error('This JPEG is incomplete or damaged. Choose another image.');
  }
  if (source === 'webp') {
    const chunk = String.fromCharCode(...head.slice(12,16));
    if (chunk === 'VP8X' && head.length >= 30) {
      validateDimensions(1 + head[24] + (head[25] << 8) + (head[26] << 16), 1 + head[27] + (head[28] << 8) + (head[29] << 16));
    } else if (chunk === 'VP8L' && head.length >= 25 && head[20] === 47) {
      validateDimensions(1 + head[21] + ((head[22] & 63) << 8), 1 + (head[22] >> 6) + (head[23] << 2) + ((head[24] & 15) << 10));
    } else if (chunk === 'VP8 ' && head.length >= 30 && head[23] === 157 && head[24] === 1 && head[25] === 42) {
      validateDimensions((head[26] + (head[27] << 8)) & 16383, (head[28] + (head[29] << 8)) & 16383);
    }
  }
  if (source === 'png') {
    if (head.length < 24) throw new Error('This PNG is incomplete or damaged. Choose another image.');
    const view = new DataView(head.buffer); validateDimensions(view.getUint32(16),view.getUint32(20));
    const bytes = new Uint8Array(await file.arrayBuffer());
    const chunks = new DataView(bytes.buffer);
    for (let at=8; at+12<=bytes.length;) {
      const length=chunks.getUint32(at);
      if (String.fromCharCode(...bytes.slice(at+4,at+8))==='acTL') throw new Error('Animated PNG is not supported. Export a still image first.');
      if (length>bytes.length-at-12) break;
      at+=12+length;
    }
  }
  return source;
}
export async function verifyOutput(blob: Blob, format: Format) {
  if (!blob.size || blob.type !== MIME[format] || signature(new Uint8Array(await blob.slice(0,16).arrayBuffer())) !== format) throw new Error(`Your browser cannot encode ${format.toUpperCase()} reliably. Try another output format or browser.`);
}
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href=url; a.download=filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
