import type {Metadata} from 'next';
import ContactForm from '@/components/ContactForm';
export const metadata:Metadata={title:'Contact — Questions and feedback | PixelConvert',description:'Contact configuration and an email composition workflow for questions about PixelConvert. No image attachments are required.',alternates:{canonical:'/contact/'}};
export default function Contact(){return <article className="shell prose-page"><span className="eyebrow">QUESTIONS & FEEDBACK</span><h1>Tell us what could be better.</h1><p className="lead">For a conversion issue, describe your browser, input format and what happened. Please do not send sensitive images.</p><ContactForm/></article>;}
