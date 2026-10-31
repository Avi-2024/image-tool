import type { Metadata } from 'next';
import { site } from '@/config/site';

/** Every route describes itself, including when shared outside search results. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, `${site.url}/`).href;
  const images = [{url: '/og-image.png', width: 1200, height: 630, alt: 'ToolValueLab Images — Convert JPG, PNG and WebP on your device'}];
  return {
    title, description, alternates: {canonical: url},
    openGraph: {type: 'website', siteName: site.name, locale: 'en_US', title, description, url, images},
    twitter: {card: 'summary_large_image', title, description, images: images.map(image => image.url)},
  };
}
