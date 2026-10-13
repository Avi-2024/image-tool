import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {normalizeFormat,signature,validateDimensions,isHex,size,difference,outputNames,verifyOutput} from '@/lib/converter/helpers';
import {getLiveConverters,getRelatedConverters,getConverterBySlug,isSupportedConversion,converters} from '@/config/converters';
const fixture=(name:string)=>new Uint8Array(readFileSync(`tests/fixtures/${name}`));
describe('real image headers',()=>{
 it.each([['alpha.png','png'],['photo.jpg','jpg'],['photo.webp','webp']])('detects %s',(name,format)=>expect(signature(fixture(name))).toBe(format));
 it('rejects false and truncated signatures',()=>{expect(signature(new Uint8Array([255,216]))).toBeUndefined();expect(signature(new TextEncoder().encode('not an image'))).toBeUndefined();});
});
describe('safe helpers',()=>{
 it.each([['jpeg','jpg'],['image/jpeg','jpg'],['JPG','jpg'],['PNG','png'],['webp','webp'],['gif',undefined]])('normalizes %s',(input,expected)=>expect(normalizeFormat(input)).toBe(expected));
 it('guards decoded allocation sizes',()=>{expect(()=>validateDimensions(8000,6000)).toThrow();expect(()=>validateDimensions(20000,1)).toThrow();expect(()=>validateDimensions(0,10)).toThrow();expect(()=>validateDimensions(6000,4000)).not.toThrow();});
 it('validates colors',()=>{expect(isHex('#ff00AA')).toBe(true);expect(isHex('red')).toBe(false);expect(isHex('#fff')).toBe(false);});
 it('formats sizes',()=>{expect(size(12)).toBe('12 B');expect(size(2048)).toBe('2.0 KB');expect(size(2*1024**2)).toBe('2.0 MB');});
 it('reports savings and increases honestly',()=>{expect(difference(1000,800)).toBe('20.0% smaller');expect(difference(1000,1200)).toBe('20.0% larger');expect(difference(1000,1000)).toBe('Same file size');});
 it('deduplicates against naturally suffixed names and case',()=>{expect(outputNames(['photo.png','photo.jpg','photo-1.png','PHOTO.webp'],'jpg')).toEqual(['photo.jpg','photo-1.jpg','photo-1-1.jpg','PHOTO-2.jpg']);});
 it('sanitizes paths and preserves Unicode',()=>{expect(outputNames(['../../हिंदी:photo.png'],'png')[0]).not.toMatch(/[/:]/);expect(outputNames(['हिंदी.png'],'png')).toEqual(['हिंदी.png']);});
 it('rejects unsupported output MIME before downloading',async()=>{await expect(verifyOutput({size:42,type:'image/png'} as Blob,'webp')).rejects.toThrow('cannot encode WEBP');});
});
describe('canonical route configuration',()=>{
 it('has exactly six unique live routes',()=>{const live=getLiveConverters();expect(live).toHaveLength(6);expect(new Set(live.map(c=>c.slug)).size).toBe(6);expect(new Set(live.map(c=>c.title)).size).toBe(6);expect(new Set(live.map(c=>c.metaDescription)).size).toBe(6);});
 it('has complete unique guidance and valid related links',()=>{for(const c of getLiveConverters()){expect(c.howToSteps.length).toBeGreaterThanOrEqual(4);expect(c.faqs.length).toBeGreaterThanOrEqual(3);expect(getRelatedConverters(c.slug)).toHaveLength(c.relatedSlugs.length);}});
 it('excludes aliases and unsupported pages',()=>{expect(getConverterBySlug('png-to-jpeg')).toBeUndefined();expect(getConverterBySlug('gif-to-jpg')).toBeUndefined();expect(isSupportedConversion('jpg','jpg')).toBe(false);expect(isSupportedConversion('png','webp')).toBe(true);});
 it('excludes planned pages',()=>{const planned={...converters[0],slug:'future',status:'planned' as const};converters.push(planned);try{expect(getLiveConverters().find(c=>c.slug==='future')).toBeUndefined();}finally{converters.pop();}});
});
