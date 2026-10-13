'use client';
import { Moon, Sun } from 'lucide-react';
export default function ThemeToggle(){
  return <button type="button" className="icon-button theme-toggle" aria-label="Toggle color theme" onClick={()=>{
    const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';
    try{localStorage.setItem('pixelconvert-theme',dark?'dark':'light');}catch{}
  }}><Sun className="sun" size={18}/><Moon className="moon" size={18}/></button>;
}
