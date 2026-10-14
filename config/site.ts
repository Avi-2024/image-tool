import { resolveSiteSettings } from './site-settings.mjs';
export const site = {
  name: 'PixelConvert',
  ...resolveSiteSettings({
    url: process.env.NEXT_PUBLIC_SITE_URL,
    indexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  }),
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
};
