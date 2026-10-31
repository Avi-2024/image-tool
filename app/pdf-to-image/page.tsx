import Link from 'next/link';
import {pageMetadata} from '@/lib/seo/metadata';
import PdfWorkspace from '@/components/PdfWorkspace';
import PdfToolLinks from '@/components/PdfToolLinks';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import {site} from '@/config/site';

export const metadata=pageMetadata('PDF to Image Converter — Export Pages as PNG or JPG | ToolValueLab Images','Turn PDF pages into real PNG or JPG images in your browser. Choose a page range, download each image or a ZIP, and keep your PDF on your device.','/pdf-to-image/');
const faqs=[
 {question:'Can I convert only some pages?',answer:'Yes. Choose the first and last page. Up to 50 pages can be converted in one batch.'},
 {question:'Should I choose PNG or JPG?',answer:'Choose PNG for sharp text and graphics. JPG is useful for smaller photo-heavy pages; it uses a white background and adjustable quality.'},
 {question:'How do I download multiple pages?',answer:'Each page has its own download action. You can also download all converted pages together as a ZIP.'},
 {question:'Can I open a password-protected PDF?',answer:'No. This tool currently accepts unencrypted PDF files up to 25 MB and 500 pages. You can select up to 50 pages per conversion.'},
];
export default function PdfToImage(){return <div className="shell main-shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Image converter</Link><span aria-hidden="true">/</span><span>PDF to images</span></nav><section className="route-hero"><span className="eyebrow">ON-DEVICE PAGE EXPORT</span><h1>PDF pages to images.</h1><p>Choose a page range and turn each PDF page into a PNG or JPG. Download one image or a ZIP of the whole selection.</p></section><PdfWorkspace mode="pdf-to-image"/><AdSlot id="pdf-image-below-tool" slotPosition="below-tool"/><section className="section how-section"><div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Choose only the pages you need.</h2><p>Rendering turns a page into pixels; text in the downloaded image is not editable.</p></div><ol className="steps"><li><span>01</span><p>Select an unencrypted PDF up to 25 MB.</p></li><li><span>02</span><p>Choose a page range of up to 50 pages and pick PNG or JPG output.</p></li><li><span>03</span><p>Convert, then download individual images or a ZIP batch.</p></li></ol></section><FAQSection faqs={faqs}/><PdfToolLinks/><JsonLd value={{'@context':'https://schema.org','@type':'WebApplication',name:'PDF to image converter',url:`${site.url}/pdf-to-image/`,applicationCategory:'MultimediaApplication',operatingSystem:'Modern web browser'}}/><JsonLd value={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}}/></div>}
