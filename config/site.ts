import { resolveSiteSettings } from './site-settings.mjs';

const settings = resolveSiteSettings({
  url: process.env.NEXT_PUBLIC_SITE_URL,
  indexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
});

const configuredGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '';
if (configuredGaId && !/^G-[A-Z0-9]+$/.test(configuredGaId)) {
  throw new Error('NEXT_PUBLIC_GA_MEASUREMENT_ID must be a GA4 measurement ID (G-...).');
}

export const site = {
  name: 'PixelConvert',
  ...settings,
  gaMeasurementId: settings.indexable && process.env.NODE_ENV === 'production' ? configuredGaId : '',
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
};
