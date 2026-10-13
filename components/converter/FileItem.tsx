import Image from 'next/image';
import { Check, Download, LoaderCircle, RotateCcw, X, AlertCircle, ArrowRight } from 'lucide-react';
import type { Format, QueueFile } from '@/lib/converter/types';
import { difference, saveBlob, size } from '@/lib/converter/helpers';
export default function FileItem({item,to,name,disabled,onRemove,onRetry}:{item:QueueFile;to:Format|'any';name:string;disabled:boolean;onRemove:()=>void;onRetry:()=>void}){
 return <li className={`file-row status-${item.status}`}>
   <div className="file-preview">{item.preview?<Image src={item.preview} alt="" width={52} height={52} unoptimized/>:<AlertCircle size={22}/>}</div>
   <div className="file-info"><span className="filename" title={item.file.name}>{item.file.name}</span><span className="file-meta">{item.source?.toUpperCase()||'FILE'} <span>·</span> {size(item.file.size)}{item.width&&<> <span>·</span> {item.width} × {item.height}</>}</span>{item.error&&<span className="file-error">{item.error}</span>}</div>
   <div className={`file-result ${item.status==='failed'?'empty-result':''}`}>{item.result?<><span className="result-size">{item.result.blob.type.replace('image/','').replace('jpeg','jpg').toUpperCase()} <span>·</span> {size(item.result.blob.size)}</span><span className="size-difference">{difference(item.file.size,item.result.blob.size)}</span></>:<span className="target-label"><ArrowRight size={14}/>{to==='any'?'Choose format':to.toUpperCase()}</span>}</div>
   <span className={`file-status ${item.status}`}>
    {item.status==='completed'?<><Check size={14}/>Ready</>:item.status==='processing'?<><LoaderCircle size={14} className="spin"/>Converting</>:item.status==='failed'?<><AlertCircle size={14}/>Failed</>:item.status==='cancelled'?'Cancelled':'Queued'}
   </span>
   <div className="file-actions">{item.result?<button className="icon-button download-button" type="button" aria-label={`Download ${name}`} title={`Download ${name}`} disabled={disabled} onClick={()=>saveBlob(item.result!.blob,name)}><Download size={18}/></button>:item.status==='failed'&&item.preview?<button className="icon-button" type="button" aria-label={`Retry ${item.file.name}`} disabled={disabled} onClick={onRetry}><RotateCcw size={17}/></button>:null}<button className="icon-button remove-button" type="button" aria-label={`Remove ${item.file.name}`} disabled={disabled} onClick={onRemove}><X size={16}/></button></div>
 </li>;
}
