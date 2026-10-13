import { uniqueId } from './helpers';
import { canUseWorker } from './capabilities';
import { convertCanvas } from './engine';
import type { Result, Settings, WorkerResponse } from './types';
export async function runConversion(file: Blob, settings: Settings, signal: AbortSignal): Promise<Result> {
  if(signal.aborted) throw new DOMException('Cancelled','AbortError');
  if(!canUseWorker()) return convertCanvas(file,settings);
  let worker: Worker;
  try {worker=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});} catch {return convertCanvas(file,settings);}
  try {
    return await new Promise<Result>((resolve,reject)=>{
      const id=uniqueId();
      const stop=()=>reject(new DOMException('Cancelled','AbortError'));
      signal.addEventListener('abort',stop,{once:true});
      const timeout=setTimeout(()=>{cleanup();reject(new Error('Conversion took too long. Try a smaller image.'));},60000);
      function cleanup(){clearTimeout(timeout);signal.removeEventListener('abort',stop);}
      worker.onmessage=({data}: MessageEvent<WorkerResponse>)=> {if(data.id!==id)return;cleanup();if(data.result)resolve(data.result);else reject(new Error(data.error));};
      worker.onerror=()=>{cleanup();reject(new Error('WORKER_UNAVAILABLE'));};
      signal.addEventListener('abort',()=>cleanup(),{once:true});
      worker.postMessage({id,file,settings});
    });
  } catch(error) {if(error instanceof Error && error.message==='WORKER_UNAVAILABLE'&&!signal.aborted)return convertCanvas(file,settings);throw error;}
  finally{worker.terminate();}
}
