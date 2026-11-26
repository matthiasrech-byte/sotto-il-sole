# Merchant Center - Ciccolella

## Architecture
Merchant Center account: 5917879218. Claimed website: https://sottoilsole.de.
The Shopify storefront is password protected; the public Astro product landing
pages are on sottoilsole.de. Do not disable Shopify's password protection solely
to satisfy the Google & YouTube app's product sync setup.

Source: Netlify function in netlify/functions/google-merchant-feed.mjs.
Public XML feed: https://sottoilsole.de/google-products.xml.

- The function reads active Ciccolella listings in Sanity, matching the website
  product-detail route logic.
- It fetches actual EUR prices, availability, product-variant IDs and barcodes
  from Shopify Storefront API on each feed request (up to Netlify CDN cache).
- It exports g:link pointing only to public Astro product detail pages.
- Only products with a single Shopify variant are currently eligible. A
  mismatch/missing product upstream returns HTTP 503, not an empty feed.
- To publish other brands in future, explicitly expand the Sanity filter
  after verifying each brand's purchase and shipping flow.
- Existing GA4, Ads and Shopify checkout pixels are unchanged.

## Environment / hosting
Netlify site's base directory must be website. Its default functions
directory then resolves to website/netlify/functions.
The runtime uses the existing PUBLIC_SANITY_PROJECT_ID and
PUBLIC_SANITY_DATASET environment variables. Optionally define
SHOPIFY_STOREFRONT_ACCESS_TOKEN; the default token is the public Storefront
token already used by the website's Shopify Buy Button.

The function uses the Shopify Storefront API version 2026-10. Revisit API
version annually. Validate the function in the Netlify deploy preview before
merging, and validate the production feed after merging.

## Merchant Center setup
1. Verify https://sottoilsole.de is both verified and claimed.
2. Open Merchant Center > Settings > Data sources > Product sources > Add.
3. Select Add products from a file / file URL, choose a scheduled fetch
   (daily recommended), set country Germany and German product language.
4. Enter https://sottoilsole.de/google-products.xml.
5. Inspect the first fetch and ensure each g:link uses
   https://sottoilsole.de/produkte/..., g:price matches checkout pricing,
   and g:availability matches current Shopify stock.
6. Configure country, shipping rates (EUR 5.99 shown on Ciccolella landing pages),
   delivery estimates and return policy in Merchant Center. Verify they match
   checkout. Check product approvals and GTIN diagnostics.
7. Do not configure a second Shopify-managed product source in the same
   Merchant Center account: duplicate or overwritten product sources are risky.
8. Check shopping landing-page consistency with Google's policies before
   activating Shopping or Performance Max ads.

## Notes
- For single-variant products, IDs are stable Shopify variant IDs.
- No GTIN is invented. Products without valid barcodes omit g:gtin; if
  manufacturer GTINs exist, populate the barcode in Shopify.
- Feeds are read by Google daily, inventory/price updates are looked up live
  when fetched, but updates in Merchant Center are not instantaneous.
- This is a product DATA feed, not a purchase tracker or a separate storefront.
