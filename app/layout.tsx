import type { Metadata } from 'next';
import { site } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:'PixelConvert — Private image conversion',description:'Convert JPG, PNG and WebP images directly in your browser. No image uploads, no account, real downloads.',icons:{icon:'/favicon.svg'},openGraph:{type:'website',siteName:site.name,title:'PixelConvert — Private image conversion',description:'Your images. Your device. Your next format.'},robots:{index:site.indexable,follow:true},verification:{google:site.googleVerification||undefined}};
const themeScript=`try{var t=localStorage.getItem('pixelconvert-theme');document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>;}
