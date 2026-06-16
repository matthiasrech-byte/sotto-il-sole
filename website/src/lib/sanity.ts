import { createClient } from '@sanity/client';

export const sanityConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-11',
  useCdn: true,
};

export const hasSanityConfig = Boolean(sanityConfig.projectId && sanityConfig.dataset);

export const sanityClient = createClient({
  projectId: sanityConfig.projectId || 'placeholder',
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  useCdn: sanityConfig.useCdn,
});
