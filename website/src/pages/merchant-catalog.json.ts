import type { APIRoute } from 'astro';
import { sanityClient } from '../lib/sanity';

// Uses the same build-time Sanity configuration as the public product pages.
// Only public catalog data is emitted. Prices/availability remain in Shopify.
export const prerender = true;

const query = `*[_type == "product" && shopEnabled == true && defined(shopifyProductId) && defined(slug.current) && brand->slug.current == "ciccolella-olivenoel"] | order(name asc) {
  name,
  "slug": slug.current,
  "shopifyProductId": shopifyProductId,
  "brandName": brand->name,
  "brandSlug": brand->slug.current,
  "description": coalesce(detailShortDescription, shortDescription, seoDescription),
  "imageUrl": coalesce(detailImage.asset->url, overviewImage.asset->url, image.asset->url),
  packSize,
  unit
}`;

export const GET: APIRoute = async () => {
  const products = await sanityClient.fetch(query);
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('No Ciccolella products available for Merchant Center');
  }
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
