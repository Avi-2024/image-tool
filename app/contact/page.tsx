import { pageMetadata } from '@/lib/seo/metadata';
import ContactForm from '@/components/ContactForm';
export const metadata=pageMetadata('Contact — Questions and feedback | ToolValueLab Images','Contact configuration and an email composition workflow for questions about ToolValueLab Images. No image attachments are required.','/contact/');
export default function Contact(){return <article className="shell prose-page"><span className="eyebrow">QUESTIONS & FEEDBACK</span><h1>Tell us what could be better.</h1><p className="lead">For a conversion issue, describe your browser, input format and what happened. Please do not send sensitive images.</p><ContactForm/></article>;}
