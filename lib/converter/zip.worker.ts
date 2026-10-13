import { zipSync } from 'fflate';
const scope=globalThis as unknown as {onmessage:((event: MessageEvent<{files:{name:string;blob:Blob}[]}>)=>void)|null;postMessage:(data:{buffer?:Uint8Array;error?:string},transfer?:Transferable[])=>void};
scope.onmessage=async({data})=>{
  try {
    const files:Record<string,Uint8Array>={};
    for(const file of data.files)files[file.name]=new Uint8Array(await file.blob.arrayBuffer());
    const buffer=zipSync(files,{level:0});scope.postMessage({buffer},[buffer.buffer as ArrayBuffer]);
  }catch{scope.postMessage({error:'Could not prepare the ZIP. Download the images individually instead.'});}
};
