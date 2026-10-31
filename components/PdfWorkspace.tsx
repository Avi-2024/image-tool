'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUp,Download,FileImage,FileText,LoaderCircle,ShieldCheck,Trash2} from 'lucide-react';
import {checkPdf,makeImagePdf,pageRange,PDF_LIMITS} from '@/lib/pdf-tools';
import {size,saveBlob,validateInput,verifyOutput} from '@/lib/converter/helpers';

type PdfResult={page:number;blob:Blob};
export default function PdfWorkspace({mode}:{mode:'image-to-pdf'|'pdf-to-image'}){
 const input=useRef<HTMLInputElement>(null),cancelled=useRef(false),renderTask=useRef<{cancel:()=>void}|null>(null);
 const [images,setImages]=useState<File[]>([]),[pdf,setPdf]=useState<File|null>(null),[pages,setPages]=useState(0),[first,setFirst]=useState(1),[last,setLast]=useState(1);
 const [format,setFormat]=useState<'png'|'jpg'>('png'),[quality,setQuality]=useState(.9),[busy,setBusy]=useState(false),[progress,setProgress]=useState(''),[error,setError]=useState(''),[result,setResult]=useState<Blob|null>(null),[results,setResults]=useState<PdfResult[]>([]);
 useEffect(()=>()=>{cancelled.current=true;renderTask.current?.cancel();},[]);
 const clearOutput=()=>{setResult(null);setResults([]);setError('');};
 const addImages=async(files:File[])=>{
  clearOutput();let total=images.reduce((sum,file)=>sum+file.size,0);const accepted:File[]=[];
  for(const file of files){
   if(images.length+accepted.length>=PDF_LIMITS.imageCount){setError('You can add up to 20 images.');break;}
   if(total+file.size>PDF_LIMITS.imageTotalBytes){setError('Images must total less than 75 MB.');break;}
   try{await validateInput(file,'any');accepted.push(file);total+=file.size;}catch(e){setError(e instanceof Error?`${file.name}: ${e.message}`:'This image is not supported.');}
  }
  setImages(current=>[...current,...accepted]);
 };
 const choosePdf=async(file:File)=>{
  clearOutput();setPdf(null);setPages(0);setProgress('Reading PDF…');
  let task:import('pdfjs-dist').PDFDocumentLoadingTask|undefined;
  try{
   await checkPdf(file);
   const pdfjs=await import('pdfjs-dist');
   pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
   task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())});
   const document=await task.promise;
   try{if(document.numPages<1||document.numPages>500)throw new Error('Choose a PDF with 1 to 500 pages.');setPdf(file);setPages(document.numPages);setFirst(1);setLast(Math.min(document.numPages,PDF_LIMITS.pages));}
   finally{await task?.destroy();}
  }catch(e){setError(e instanceof Error&&e.name==='PasswordException'?'Password-protected PDFs are not supported.':e instanceof Error?e.message:'This PDF could not be opened.');if(task)await task.destroy().catch(()=>{});}
  finally{setProgress('');}
 };
 const convertImages=async()=>{
  if(busy||!images.length)return;setBusy(true);setError('');setResult(null);setProgress(`0 of ${images.length} images added`);
  try{const blob=await makeImagePdf(images,done=>setProgress(`${done} of ${images.length} images added`));setResult(blob);setProgress('PDF ready');}
  catch(e){setError(e instanceof Error?e.message:'Could not create the PDF.');setProgress('');}
  finally{setBusy(false);}
 };
 const convertPdf=async()=>{
  if(busy||!pdf)return;setBusy(true);setError('');setResults([]);cancelled.current=false;
  let pdfDocument:import('pdfjs-dist').PDFDocumentProxy|undefined;
  let loadingTask:import('pdfjs-dist').PDFDocumentLoadingTask|undefined;
  try{
   const chosen=pageRange(Number(first),Number(last),pages);
   const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
   loadingTask=pdfjs.getDocument({data:new Uint8Array(await pdf.arrayBuffer())});
   pdfDocument=await loadingTask.promise;
   const output:PdfResult[]=[];let bytes=0;
   for(const number of chosen){
    if(cancelled.current)throw new Error('Conversion cancelled.');
    setProgress(`Rendering page ${number} · ${output.length} of ${chosen.length} ready`);
    const page=await pdfDocument.getPage(number),base=page.getViewport({scale:1});
    if(!base.width||!base.height||base.width*base.height>100_000_000)throw new Error(`Page ${number} is too large to render safely.`);
    const scale=Math.min(2,Math.sqrt(8_000_000/(base.width*base.height)),8192/Math.max(base.width,base.height));
    const viewport=page.getViewport({scale});
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    try{
     const task=page.render({canvas,viewport,background:'#ffffff'});renderTask.current=task;
     await task.promise;renderTask.current=null;
     if(cancelled.current)throw new Error('Conversion cancelled.');
     const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,`image/${format==='jpg'?'jpeg':'png'}`,quality));
     if(!blob)throw new Error(`Page ${number} could not be encoded.`);
     await verifyOutput(blob,format);
     bytes+=blob.size;if(bytes>PDF_LIMITS.outputBytes)throw new Error('Output exceeds 100 MB. Choose fewer pages or JPG.');
     output.push({page:number,blob});
    }finally{canvas.width=0;canvas.height=0;page.cleanup();}
   }
   setResults(output);setProgress(`${output.length} page${output.length===1?'':'s'} ready`);
  }catch(e){setError(cancelled.current?'Conversion cancelled.':e instanceof Error?e.message:'Could not convert the PDF.');setProgress('');}
  finally{renderTask.current=null;await loadingTask?.destroy();setBusy(false);}
 };
 const downloadAll=async()=>{
  if(results.length===1){saveBlob(results[0].blob,`page-${results[0].page}.${format}`);return;}
  if(!results.length)return;
  if(results.reduce((sum,item)=>sum+item.blob.size,0)>PDF_LIMITS.zipBytes){setError('This batch is too large for a ZIP on your device. Download pages individually.');return;}
  setBusy(true);setError('');setProgress('Preparing ZIP…');
  let worker:Worker|undefined;
  try{
   worker=new Worker(new URL('../lib/converter/zip.worker.ts',import.meta.url),{type:'module'});
   const active=worker;
   const zip=await new Promise<Uint8Array>((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('ZIP preparation timed out. Download pages individually.')),60000);
    active.onmessage=({data}:MessageEvent<{buffer?:Uint8Array;error?:string}>)=>{clearTimeout(timeout);if(data.buffer)resolve(data.buffer);else reject(new Error(data.error||'ZIP could not be created.'));};
    active.onerror=()=>{clearTimeout(timeout);reject(new Error('ZIP could not be created.'));};
    active.postMessage({files:results.map(item=>({name:`page-${item.page}.${format}`,blob:item.blob}))});
   });
   saveBlob(new Blob([new Uint8Array(zip)],{type:'application/zip'}),'pdf-pages.zip');
  }catch(e){setError(e instanceof Error?e.message:'ZIP could not be created.');}
  finally{worker?.terminate();setBusy(false);setProgress(`${results.length} pages ready`);}
 };
 let validRange=true;try{if(pages)pageRange(first,last,pages);}catch{validRange=false;}
 const selected=mode==='image-to-pdf'?images.length>0:!!pdf;
 return <section className="pdf-workspace" aria-label={mode==='image-to-pdf'?'Images to PDF workspace':'PDF to images workspace'}>
  <div className="workspace-heading"><span className="workspace-title">{mode==='image-to-pdf'?'Images → PDF':'PDF → images'}</span><span className="local-label"><ShieldCheck size={15}/>On your device</span></div>
  <div className="pdf-workspace-body">
   <div className="pdf-upload"><span className="pdf-upload-icon">{mode==='image-to-pdf'?<FileImage size={32}/>:<FileText size={32}/>}</span><strong>{selected?mode==='image-to-pdf'?`${images.length} image${images.length===1?'':'s'} selected`:pdf?.name:mode==='image-to-pdf'?'Add images to your PDF':'Choose a PDF to convert'}</strong><p>{mode==='image-to-pdf'?'JPG, PNG and still WebP · up to 20 images, 75 MB total':'One PDF up to 25 MB · choose up to 50 pages at once'}</p>
    <input ref={input} type="file" className="visually-hidden" tabIndex={-1} accept={mode==='image-to-pdf'?'image/jpeg,image/png,image/webp':'.pdf,application/pdf'} multiple={mode==='image-to-pdf'} disabled={busy} aria-label={mode==='image-to-pdf'?'Choose image files':'Choose PDF file'} onChange={event=>{const files=Array.from(event.target.files||[]);event.target.value='';if(mode==='image-to-pdf')void addImages(files);else if(files[0])void choosePdf(files[0]);}}/>
    <button type="button" className="button secondary" disabled={busy} onClick={()=>input.current?.click()}>{selected?mode==='image-to-pdf'?'Add more images':'Choose another PDF':mode==='image-to-pdf'?'Choose images':'Choose PDF'}</button>
   </div>
   {mode==='image-to-pdf'&&images.length>0&&<><h2 className="pdf-section-title">Page order</h2><ol className="pdf-file-list">{images.map((file,index)=><li key={`${file.name}-${index}`}><span className="pdf-file-index">{index+1}</span><span className="pdf-file-name" title={file.name}>{file.name}<small>{size(file.size)}</small></span><button type="button" className="icon-button" aria-label={`Move ${file.name} up`} disabled={busy||index===0} onClick={()=>{clearOutput();setImages(current=>{const copy=[...current];[copy[index-1],copy[index]]=[copy[index],copy[index-1]];return copy;});}}><ArrowUp size={17}/></button><button type="button" className="icon-button" aria-label={`Move ${file.name} down`} disabled={busy||index===images.length-1} onClick={()=>{clearOutput();setImages(current=>{const copy=[...current];[copy[index+1],copy[index]]=[copy[index],copy[index+1]];return copy;});}}><ArrowDown size={17}/></button><button type="button" className="icon-button" aria-label={`Remove ${file.name}`} disabled={busy} onClick={()=>{clearOutput();setImages(current=>current.filter((_,i)=>i!==index));}}><Trash2 size={17}/></button></li>)}</ol><p className="pdf-helper">Images fit on A4 pages in their original order and aspect ratio. Transparent areas stay transparent where PDF viewers support them.</p></>}
   {mode==='pdf-to-image'&&pdf&&<><div className="pdf-settings"><span>{pages} page{pages===1?'':'s'} in this PDF</span><label>From page<input type="number" min="1" max={pages} value={first} disabled={busy} onChange={e=>{clearOutput();setFirst(Number(e.target.value));}}/></label><label>To page<input type="number" min="1" max={pages} value={last} disabled={busy} onChange={e=>{clearOutput();setLast(Number(e.target.value));}}/></label><label>Output<select value={format} disabled={busy} onChange={e=>{clearOutput();setFormat(e.target.value as 'png'|'jpg');}}><option value="png">PNG</option><option value="jpg">JPG</option></select></label></div>{format==='jpg'&&<label className="pdf-quality">JPG quality: {Math.round(quality*100)}%<input type="range" min="40" max="100" value={Math.round(quality*100)} disabled={busy} onChange={e=>{clearOutput();setQuality(Number(e.target.value)/100);}}/></label>}<p className="pdf-helper">Each selected page becomes an image. JPG uses a white background; PNG keeps sharp text but can make larger files.</p></>}
   {error&&<p role="alert" className="converter-alert">{error}</p>}
   <div className="pdf-actions"><span role="status" aria-live="polite">{progress||'Files stay in your browser.'}</span>{busy&&mode==='pdf-to-image'&&<button type="button" className="button secondary" onClick={()=>{cancelled.current=true;renderTask.current?.cancel();}}>Cancel</button>}{selected&&<button type="button" className="button primary" disabled={busy||(mode==='pdf-to-image'&&!validRange)} onClick={mode==='image-to-pdf'?convertImages:convertPdf}>{busy?<LoaderCircle size={17} className="spin"/>:null}{busy?'Processing…':mode==='image-to-pdf'?'Create PDF':'Convert pages'}</button>}{result&&<button type="button" className="button secondary" onClick={()=>saveBlob(result,'images.pdf')}><Download size={17}/>Download PDF</button>}{results.length>0&&<button type="button" className="button secondary" disabled={busy} onClick={downloadAll}><Download size={17}/>{results.length===1?'Download image':'Download all · ZIP'}</button>}</div>
   {results.length>1&&<ul className="pdf-result-list">{results.map(item=><li key={item.page}>Page {item.page} · {size(item.blob.size)}<button type="button" className="text-button" disabled={busy} onClick={()=>saveBlob(item.blob,`page-${item.page}.${format}`)}>Download</button></li>)}</ul>}
  </div>
 </section>;
}
