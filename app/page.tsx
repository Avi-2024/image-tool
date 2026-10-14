import { pageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, SlidersHorizontal, Layers } from 'lucide-react';
import Converter from '@/components/Converter';
import RelatedConverters from '@/components/RelatedConverters';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { getLiveConverters } from '@/config/converters';
import { site } from '@/config/site';
export const metadata=pageMetadata('Free Image Converter — JPG, PNG & WebP | PixelConvert','Convert images privately on your device. Batch convert JPG, PNG and WebP with quality controls, transparency handling and real ZIP downloads.','/');
const faqs=[{question:'Do my images leave my device?',answer:'No image payload is uploaded by this converter. Your browser loads the site assets, then decodes and converts your selected files locally. See our privacy page for the details.'},{question:'Which image formats can I convert?',answer:'Still JPG/JPEG, PNG and WebP images. Choose one of those three output formats. SVG, GIF, HEIC, AVIF and animated images are not supported.'},{question:'Will my converted files be smaller?',answer:'It depends on the image and the output format. PNG copies of photographs can be larger. The queue shows actual sizes and labels both smaller and larger results honestly.'},{question:'Is there a file limit?',answer:'You can select 30 files, up to 25 MB each. Images must be under 40 megapixels and 16,384 pixels per side. Your device may need smaller batches; ZIP downloads are limited to 150 MB of output.'}];
export default function Home(){return <div className="shell main-shell">
 <section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="status-dot"/>FREE IMAGE CONVERTER</span><h1>Convert images.<br/><span>Keep them private.</span></h1><p>Change JPG, PNG and WebP formats<br className="desktop-break"/> without uploading your files.</p></div><div className="hero-aside"><ShieldCheck className="privacy-symbol" size={30} strokeWidth={1.4}/><strong>Local by default.</strong><span>No uploads. No account.<br/>Just the file you need.</span></div></section>
 <Converter/><AdSlot id="home-below-tool" slotPosition="below-tool"/>
 <div className="benefit-strip"><div><ShieldCheck size={18}/><span>Locally processed</span></div><div><Layers size={18}/><span>Up to 30 images</span></div><div><SlidersHorizontal size={18}/><span>Quality on your terms</span></div></div>
 <RelatedConverters items={getLiveConverters()}/>
 <section className="how-section section"><div className="section-heading"><span className="eyebrow">LESS FRICTION</span><h2>From your device.<br/>Back to your device.</h2><p>No detours through an upload server.</p><Link href="/privacy/" className="inline-link">How local processing works <ArrowUpRight size={15}/></Link></div><ol className="steps"><li><span>01</span><div><h3>Choose your images</h3><p>Drop a batch or browse your files. We check the actual image format before adding a preview.</p></div></li><li><span>02</span><div><h3>Make it your format</h3><p>Pick JPG, PNG or WebP. Adjust quality and a background where the format needs them.</p></div></li><li><span>03</span><div><h3>Take your files with you</h3><p>See the real output size, then download an image or a ZIP. Clear the queue when you’re done.</p></div></li></ol></section>
 <FAQSection faqs={faqs}/>
 <JsonLd value={{'@context':'https://schema.org','@type':'WebSite',name:site.name,url:site.url}}/>
 <JsonLd value={{'@context':'https://schema.org','@type':'WebApplication',name:'PixelConvert Image Converter',url:site.url,applicationCategory:'MultimediaApplication',operatingSystem:'Modern web browser',browserRequirements:'JavaScript and Canvas image encoding required'}}/>
 <JsonLd value={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}}/>
 </div>;}
