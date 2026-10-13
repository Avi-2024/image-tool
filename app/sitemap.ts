import type {MetadataRoute} from 'next';
import {site} from '@/config/site';
import {getLiveConverters} from '@/config/converters';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return ['',...getLiveConverters().map(c=>c.slug),'about','contact','privacy'].map(path=>({url:`${site.url}/${path?`${path}/`:''}`}));}
