import { site } from '@/config/site';
export default function AdSlot({id,slotPosition}:{id:string;slotPosition:'below-tool'|'in-content'}){return site.adsEnabled?<aside id={id} data-position={slotPosition} className="ad-slot" aria-label="Advertisement placeholder"><span>ADVERTISEMENT</span><p>Ad placement reserved. No ad network is connected.</p></aside>:null;}
