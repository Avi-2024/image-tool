import { verifyOutput } from './helpers';
export async function canEncodeWebp() {
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=1;
  try {
    const blob=await new Promise<Blob | null>(resolve=>canvas.toBlob(resolve,'image/webp'));
    if(!blob) return false;
    await verifyOutput(blob,'webp');return true;
  } catch{return false;} finally{canvas.width=canvas.height=0;}
}
export function canUseWorker() { return typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined'; }
