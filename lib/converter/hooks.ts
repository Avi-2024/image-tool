'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LIMITS } from './constants';
import { outputNames, saveBlob, validateInput, validateDimensions, uniqueId } from './helpers';
import { runConversion } from './worker-client';
import type { QueueFile, Selection, Settings } from './types';
export function useConverter(from: Selection) {
  const [files,setFiles]=useState<QueueFile[]>([]),[busy,setBusy]=useState(false),[adding,setAdding]=useState(false),[zipBusy,setZipBusy]=useState(false),[message,setMessage]=useState('');
  const current=useRef<QueueFile[]>([]), mounted=useRef(true), controller=useRef<AbortController|null>(null), selecting=useRef(false),zip=useRef<Worker|null>(null),zipTimeout=useRef<ReturnType<typeof setTimeout>|null>(null);
  const update=useCallback((fn:(files:QueueFile[])=>QueueFile[])=>{ current.current=fn(current.current);if(mounted.current)setFiles(current.current); },[]);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;controller.current?.abort();zip.current?.terminate();if(zipTimeout.current)clearTimeout(zipTimeout.current);for(const file of current.current)if(file.preview)URL.revokeObjectURL(file.preview);};},[]);
  const add=async(list:File[])=>{
    if(selecting.current||controller.current||zip.current)return;
    selecting.current=true;setAdding(true);setMessage('');
    const slots=LIMITS.files-current.current.length;
    if(list.length>slots)setMessage(`You can select up to ${LIMITS.files} images. ${list.length-slots} extra files were not added.`);
    const entries:QueueFile[]=[];
    try {
      for(const file of list.slice(0,slots)) {
        const entry:QueueFile={id:uniqueId(),file,status:'pending'};
        try {
          entry.source=await validateInput(file,from);
          const url=URL.createObjectURL(file),image=new Image();
          try {image.src=url;await image.decode();validateDimensions(image.naturalWidth,image.naturalHeight);entry.width=image.naturalWidth;entry.height=image.naturalHeight;entry.preview=url;}
          catch{URL.revokeObjectURL(url);throw new Error('This image could not be opened. It may be damaged or too large.');}
          finally{image.src='';}
        }catch(error){entry.status='failed';entry.error=error instanceof Error?error.message:'This image could not be opened.';}
        entries.push(entry);
      }
      if(mounted.current)update(old=>[...old,...entries]);else for(const entry of entries)if(entry.preview)URL.revokeObjectURL(entry.preview);
    }finally{selecting.current=false;if(mounted.current)setAdding(false);}
  };
  const invalidate=()=>{if(controller.current||selecting.current||zip.current)return;update(old=>old.map(f=>({...f,result:undefined,status:f.preview?'pending':'failed'})));setMessage('');};
  const start=async(settings:Settings,failedOnly=false)=>{
    if(controller.current||selecting.current||zip.current)return;
    const jobs=current.current.filter(f=>f.preview&&(failedOnly?f.status==='failed':f.status!=='completed'));
    if(!jobs.length)return;
    const abort=new AbortController();controller.current=abort;setBusy(true);setMessage('');let next=0;
    const consumers=async()=>{
      while(next<jobs.length&&!abort.signal.aborted){
        const item=jobs[next++];update(old=>old.map(f=>f.id===item.id?{...f,status:'processing',error:undefined,result:undefined}:f));
        try {
          const result=await runConversion(item.file,settings,abort.signal);
          if(!abort.signal.aborted&&mounted.current)update(old=>old.map(f=>f.id===item.id?{...f,status:'completed',result}:f));
        }catch(error){if(!abort.signal.aborted&&mounted.current)update(old=>old.map(f=>f.id===item.id?{...f,status:'failed',error:error instanceof Error?error.message:'Conversion failed. Try another image.'}:f));}
        await new Promise(resolve=>setTimeout(resolve,0));
      }
    };
    const count=window.matchMedia('(max-width: 768px)').matches?1:2;
    await Promise.all(Array.from({length:count},consumers));
    if(controller.current===abort)controller.current=null;
    if(mounted.current)setBusy(false);
  };
  const cancel=()=>{controller.current?.abort();update(old=>old.map(f=>f.status==='processing'||f.status==='pending'?{...f,status:'cancelled',result:undefined}:f));};
  const remove=(id:string)=>{if(controller.current||selecting.current||zip.current)return;update(old=>{const file=old.find(f=>f.id===id);if(file?.preview)URL.revokeObjectURL(file.preview);return old.filter(f=>f.id!==id);});};
  const clear=()=>{if(controller.current||selecting.current||zip.current)return;for(const f of current.current)if(f.preview)URL.revokeObjectURL(f.preview);update(()=>[]);setMessage('');};
  const downloadZip=(settings:Settings)=>{
    const completed=current.current.filter(f=>f.result);if(!completed.length||zip.current||controller.current)return;
    if(completed.reduce((sum,f)=>sum+f.result!.blob.size,0)>LIMITS.zipBytes){setMessage('This batch is too large for a safe ZIP download (150 MB limit). Download each image individually.');return;}
    setMessage('');
    try {
      const worker=new Worker(new URL('./zip.worker.ts',import.meta.url),{type:'module'});zip.current=worker;setZipBusy(true);
      const names=outputNames(current.current.map(f=>f.file.name),settings.to);
      const timeout=setTimeout(()=>{finish('ZIP preparation took too long. Download each image individually.');},60000);zipTimeout.current=timeout;
      const finish=(error?:string)=>{clearTimeout(timeout);zipTimeout.current=null;worker.terminate();zip.current=null;if(mounted.current){setZipBusy(false);if(error)setMessage(error);}};
      worker.onmessage=({data}:MessageEvent<{buffer?:Uint8Array;error?:string}>)=>{if(data.buffer)saveBlob(new Blob([data.buffer as Uint8Array<ArrayBuffer>],{type:'application/zip'}),'converted-images.zip');finish(data.error);};
      worker.onerror=()=>finish('ZIP preparation is unavailable. Download each image individually.');
      worker.postMessage({files:completed.map(f=>({name:names[current.current.findIndex(item=>item.id===f.id)],blob:f.result!.blob}))});
    }catch{zip.current=null;setZipBusy(false);setMessage('Your browser cannot create a ZIP. Download each image individually.');}
  };
  return {files,busy,adding,zipBusy,message,add,start,cancel,clear,remove,invalidate,downloadZip};
}
