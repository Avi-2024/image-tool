'use client';
import { useRef, useState } from 'react';
import { ArrowUp, Plus } from 'lucide-react';
import type { Selection } from '@/lib/converter/types';
import { MIME } from '@/lib/converter/constants';
export default function Dropzone({from,compact,disabled,onAdd}:{from:Selection;compact:boolean;disabled:boolean;onAdd:(files:File[])=>void}){
 const input=useRef<HTMLInputElement>(null),[drag,setDrag]=useState(false);const depth=useRef(0);
 return <div className={`dropzone ${compact?'compact':''} ${drag?'dragover':''}`} onDragEnter={e=>{e.preventDefault();depth.current++;if(!disabled)setDrag(true);}} onDragLeave={e=>{e.preventDefault();if(--depth.current<=0)setDrag(false);}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();depth.current=0;setDrag(false);if(!disabled)onAdd(Array.from(e.dataTransfer.files));}}>
  <input id="image-input" ref={input} type="file" className="visually-hidden" tabIndex={-1} multiple accept={from==='any'?'image/jpeg,image/png,image/webp':MIME[from]} aria-label="Choose images" onChange={e=>{if(e.target.files)onAdd(Array.from(e.target.files));e.target.value='';}} disabled={disabled}/>
  {compact?<button type="button" className="text-button add-button" disabled={disabled} onClick={()=>input.current?.click()}><Plus size={17}/> Add images</button>:<>
    <div className="upload-symbol" aria-hidden="true"><span className="symbol-sheet"/><ArrowUp size={25} strokeWidth={1.7}/></div>
    <h3>{drag?'Drop your images here':'Drop images. Change formats.'}</h3>
    <p>Drag your files here, or choose them from your device.</p>
    <button type="button" className="button primary browse-button" onClick={()=>input.current?.click()} disabled={disabled}><Plus size={17}/>Choose images</button>
    <span className="upload-limits">{from==='any'?'JPG, PNG & WebP':`${from.toUpperCase()} images`}<span aria-hidden="true">·</span>30 files<span aria-hidden="true">·</span>25 MB each</span>
  </>}
 </div>;
}
