'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Check, Download, LoaderCircle } from 'lucide-react';
import { useConverter } from '@/lib/converter/hooks';
import { canEncodeWebp } from '@/lib/converter/capabilities';
import { outputNames } from '@/lib/converter/helpers';
import type { Selection, Settings } from '@/lib/converter/types';
import Dropzone from './converter/Dropzone';
import FileItem from './converter/FileItem';
import ConversionSettings from './converter/ConversionSettings';
export default function Converter({defaultFrom='any',defaultTo='any'}:{defaultFrom?:Selection;defaultTo?:Selection}){
 const [from,setFrom]=useState(defaultFrom),[to,setTo]=useState(defaultTo),[quality,setQuality]=useState(.9),[background,setBackground]=useState('#ffffff'),[webp,setWebp]=useState(true);
 const queue=useConverter(from);const {files,busy,adding,zipBusy}=queue;
 useEffect(()=>{document.documentElement.setAttribute('data-converter-hydrated','true');let active=true;canEncodeWebp().then(value=>{if(active)setWebp(value);});return()=>{active=false;};},[]);
 const disabled=busy||adding||zipBusy,done=files.filter(f=>f.status==='completed').length,failed=files.filter(f=>f.status==='failed').length;
 const ready=files.some(f=>f.preview&&f.status!=='completed'),recoverable=files.some(f=>f.preview&&f.status==='failed'),remaining=files.length-done-failed;
 const settings:Settings|undefined=to==='any'?undefined:{to,quality,background};
 const names=outputNames(files.map(f=>f.file.name),to==='any'?'jpg':to);
 const change=(fn:()=>void)=>{if(disabled)return;queue.invalidate();fn();};
 return <section id="converter" className={`converter ${files.length?'has-files':''}`} aria-label="Image converter">
  <div className="workspace-heading"><span className="workspace-title">Image converter <span className="workspace-format">JPG / PNG / WEBP</span></span><span className="local-label"><ShieldCheck size={15}/>On your device</span></div>
  <ConversionSettings from={from} to={to} quality={quality} background={background} locked={defaultTo!=='any'} disabled={disabled} webp={webp} alpha={from!=='jpg'&&(!files.length||files.some(f=>f.source!=='jpg'))} setFrom={v=>{queue.clear();setFrom(v);}} setTo={v=>change(()=>setTo(v))} setQuality={v=>change(()=>setQuality(v))} setBackground={v=>change(()=>setBackground(v))}/>
  {files.length===0&&<Dropzone from={from} compact={false} disabled={disabled} onAdd={queue.add}/>}
  {files.length>0&&<div className="queue-section"><div className="queue-heading"><span>{files.length} image{files.length===1?'':'s'} <span className="queue-summary">{done>0&&`· ${done} ready`}{failed>0&&` · ${failed} failed`}</span></span><div className="queue-tools"><Dropzone from={from} compact disabled={disabled} onAdd={queue.add}/><button type="button" className="text-button" disabled={disabled} onClick={queue.clear}>Clear all</button></div></div><ul className="file-list">{files.map((item,index)=><FileItem key={item.id} item={item} to={to} name={names[index]} disabled={disabled} onRemove={()=>queue.remove(item.id)} onRetry={()=>settings&&queue.start(settings,true)}/>)}</ul></div>}
  {queue.message&&<p role="alert" className="converter-alert">{queue.message}</p>}
  {!webp&&<p className="converter-alert" role="status">WebP encoding is unavailable in this browser. Choose JPG or PNG, or try a newer browser.</p>}
  <div className="workspace-footer"><div className="workspace-feedback" role="status" aria-live="polite">{adding?<><LoaderCircle size={15} className="spin"/>Checking your images…</>:busy?<><LoaderCircle size={15} className="spin"/>{done+failed} of {files.length} processed</>:done>0?<><Check size={16}/>{done} image{done===1?'':'s'} ready{failed>0?` · ${failed} excluded from ZIP`:''}{remaining>0?` · ${remaining} remaining`:''}</>:<><ShieldCheck size={15}/>Your files stay in your browser.</>}</div>
  {busy?<button className="button secondary" type="button" onClick={queue.cancel}>Cancel conversion</button>:files.length>0&&<div className="batch-actions">{done>0&&ready&&<button className="button secondary" type="button" disabled={disabled} onClick={()=>settings&&queue.downloadZip(settings)}>Download {done} ready</button>}{ready?<button className="button primary" type="button" disabled={disabled||!settings||(to==='webp'&&!webp)} onClick={()=>settings&&queue.start(settings)}>{recoverable&&!files.some(f=>f.status==='pending'||f.status==='cancelled')?'Retry failed':'Convert images'}<ArrowRight size={17}/></button>:done>0?<button className="button primary" type="button" disabled={disabled} onClick={()=>settings&&queue.downloadZip(settings)}>{zipBusy?<LoaderCircle size={17} className="spin"/>:<Download size={17}/>} {zipBusy?'Preparing ZIP…':'Download all · ZIP'}</button>:null}</div>}
  </div>
  {busy&&<progress className="batch-progress" max={files.length} value={done+failed} aria-label="Batch conversion progress"/>}
 </section>;
}
