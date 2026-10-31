import Link from 'next/link';
import { Brand } from './Header';
import AnalyticsConsent from '@/components/AnalyticsConsent';
export default function Footer(){return <footer className="site-footer"><div className="shell footer-inner"><div><Brand/><p>A small tool. A simpler workflow.</p></div><nav aria-label="Footer navigation"><Link href="/privacy/">Privacy</Link><Link href="/about/">About</Link><Link href="/contact/">Contact</Link></nav><AnalyticsConsent/><span className="copyright">© {new Date().getFullYear()} ToolValueLab Images</span></div></footer>;}
