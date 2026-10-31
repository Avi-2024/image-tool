import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {pdfTools} from '@/config/pdf-tools';
export default function PdfToolLinks(){return <section className="section pdf-tool-links" aria-labelledby="pdf-links-title"><div className="section-heading"><span className="eyebrow">PDF & IMAGE</span><h2 id="pdf-links-title">Images and PDFs, together.</h2><p>Two focused tools. Your files are processed in your browser.</p></div><div className="pdf-tool-grid">{pdfTools.map(tool=><Link href={`/${tool.slug}/`} key={tool.slug}><strong>{tool.label}</strong><span>{tool.description}</span><ArrowRight size={18} aria-hidden="true"/></Link>)}</div></section>}
