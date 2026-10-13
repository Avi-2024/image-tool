import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
export function Brand(){return <Link href="/" className="brand" aria-label="PixelConvert home"><span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>Pixel<span className="brand-light">Convert</span></span></Link>;}
export default function Header(){return <header className="site-header"><div className="shell header-inner"><Brand/><nav aria-label="Main navigation"><Link href="/#converter">Convert</Link><Link href="/#tools">Tools</Link><Link href="/about/" className="nav-about">About <ArrowUpRight size={13}/></Link></nav><ThemeToggle/></div></header>;}
