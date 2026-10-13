export const site = {
  name: 'PixelConvert',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
};
