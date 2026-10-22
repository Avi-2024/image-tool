import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Converter from '@/components/Converter';
import FAQSection from '@/components/FAQSection';
import FormatDecisionGuide from '@/components/FormatDecisionGuide';
import RelatedConverters from '@/components/RelatedConverters';
import JsonLd from '@/components/JsonLd';
import AdSlot from '@/components/AdSlot';
import {getLiveConverters,getConverterBySlug,getRelatedConverters} from '@/config/converters';
import {site} from '@/config/site';
export const dynamicParams=false;
export const generateStaticParams=()=>getLiveConverters().map(c=>({slug:c.slug}));
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params,c=getConverterBySlug(slug);if(!c)return {};return pageMetadata(c.title,c.metaDescription,`/${slug}/`);}
export default async function ConverterPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params,c=getConverterBySlug(slug);if(!c)notFound();return <div className="shell main-shell"><nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Image converter</Link><span aria-hidden="true">/</span><span>{c.from.toUpperCase()} to {c.to.toUpperCase()}</span></nav><section className="route-hero"><span className="eyebrow">ON-DEVICE CONVERSION</span><h1>{c.h1}</h1><p>{c.intro}</p></section><Converter defaultFrom={c.from} defaultTo={c.to}/><AdSlot id="converter-below-tool" slotPosition="below-tool"/><section className="section how-section"><div className="section-heading"><span className="eyebrow">YOUR NEXT STEP</span><h2>How to convert {c.from.toUpperCase()} to {c.to.toUpperCase()}.</h2><p>{c.extraNotes}</p></div><ol className="steps">{c.howToSteps.map((step,index)=><li key={step}><span>0{index+1}</span><p>{step}</p></li>)}</ol></section>{c.decisionGuide && <FormatDecisionGuide guide={c.decisionGuide}/>}<FAQSection faqs={c.faqs}/><RelatedConverters items={getRelatedConverters(slug)} title="Another format in mind?"/><JsonLd value={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Image converter',item:site.url},{'@type':'ListItem',position:2,name:`${c.from.toUpperCase()} to ${c.to.toUpperCase()}`,item:`${site.url}/${slug}/`}]}}/><JsonLd value={{'@context':'https://schema.org','@type':'WebApplication',name:`${c.from.toUpperCase()} to ${c.to.toUpperCase()} converter`,url:`${site.url}/${slug}/`,applicationCategory:'MultimediaApplication',operatingSystem:'Modern web browser'}}/><JsonLd value={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:c.faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}}/></div>;}
