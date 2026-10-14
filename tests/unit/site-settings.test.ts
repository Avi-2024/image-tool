import {describe, expect, it} from 'vitest';
import {resolveSiteSettings} from '@/config/site-settings.mjs';

describe('launch configuration', () => {
  it('keeps unconfigured and explicitly private builds out of the index', () => {
    expect(resolveSiteSettings().indexable).toBe(false);
    expect(resolveSiteSettings({url:'https://images.my-domain.com', indexing:'false'}).indexable).toBe(false);
  });
  it('normalizes the public origin and enables explicit production indexing', () => {
    expect(resolveSiteSettings({url:'https://images.my-domain.com/', indexing:'true'})).toMatchObject({url:'https://images.my-domain.com', indexable:true});
  });
  it.each(['http://localhost:3000', 'https://127.0.0.1', 'https://example.com', 'https://preview.test', 'http://images.my-domain.com'])('rejects unsafe indexed origin %s', url => {
    expect(() => resolveSiteSettings({url, indexing:'true'})).toThrow();
  });
  it.each(['https://images.my-domain.com/tool', 'https://user:pass@images.my-domain.com', 'https://images.my-domain.com/?a=1', 'https://images.my-domain.com/#top', 'javascript:alert(1)'])('rejects malformed origin %s', url => {
    expect(() => resolveSiteSettings({url})).toThrow();
  });
  it('rejects mistyped flags and contact addresses', () => {
    expect(() => resolveSiteSettings({indexing:'yes'})).toThrow();
    expect(() => resolveSiteSettings({contactEmail:'invalid'})).toThrow();
  });
});
