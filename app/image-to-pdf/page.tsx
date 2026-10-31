import Link from 'next/link';
import {pageMetadata} from '@/lib/seo/metadata';
import PdfWorkspace from '@/components/PdfWorkspace';
import PdfToolLinks from '@/components/PdfToolLinks';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import {site} from '@/config/site';

export const metadata=pageMetadata('Image to PDF Converter — Combine JPG, PNG & WebP | ToolValueLab Images','Combine images into one PDF in your chosen order. JPG, PNG and still WebP files are processed privately on your device, with no upload or account.','/image-to-pdf/');
const faqs=[
 {question:'Can I choose the page order?',answer:'Yes. Add up to 20 images and use the up and down controls to arrange the PDF pages before creating it.'},
 {question:'What page size will the PDF use?',answer:'Each image fits inside an A4 page with a small margin. Landscape images use a landscape A4 page, and their aspect ratio is preserved.'},
 {question:'Are my images uploaded?',answer:'No. Your browser reads the selected images and creates the PDF locally. The output is downloaded directly to your device.'},
 {question:'Can I include WebP images?',answer:'Yes, still WebP images are decoded in your browser and embedded as PNG. Animated WebP is not supported.'},
];
export default function ImageToPdf(){return <div className="shell main-shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Image converter</Link><span aria-hidden="true">/</span><span>Images to PDF</span></nav><section className="route-hero"><span className="eyebrow">PRIVATE PDF CREATION</span><h1>Images to PDF. In your order.</h1><p>Combine JPG, PNG and still WebP images into a single PDF. Arrange pages, then download the finished file without sending images to a server.</p></section><PdfWorkspace mode="image-to-pdf"/><AdSlot id="image-pdf-below-tool" slotPosition="below-tool"/><section className="section how-section"><div className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>From images to one document.</h2><p>Keep your originals. PDF creation does not edit the image files you selected.</p></div><ol className="steps"><li><span>01</span><p>Choose JPG, PNG or still WebP images, up to 20 files and 75 MB combined.</p></li><li><span>02</span><p>Move images up or down to set the final PDF page order.</p></li><li><span>03</span><p>Create the PDF and download it. Images fit on A4 pages without cropping.</p></li></ol></section><FAQSection faqs={faqs}/><PdfToolLinks/><JsonLd value={{'@context':'https://schema.org','@type':'WebApplication',name:'Images to PDF converter',url:`${site.url}/image-to-pdf/`,applicationCategory:'MultimediaApplication',operatingSystem:'Modern web browser'}}/><JsonLd value={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}}/></div>}
