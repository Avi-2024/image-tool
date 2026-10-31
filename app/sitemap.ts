import type {MetadataRoute} from 'next';
import {site} from '@/config/site';
import {getLiveConverters} from '@/config/converters';
import {pdfTools} from '@/config/pdf-tools';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return ['',...getLiveConverters().map(c=>c.slug),...pdfTools.map(tool=>tool.slug),'about','contact','privacy'].map(path=>({url:`${site.url}/${path?`${path}/`:''}`}));}
