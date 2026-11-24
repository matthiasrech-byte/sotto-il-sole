# Google tracking / SOTTO IL SOLE

The Astro website and Shopify checkout are two separate systems.

## Astro storefront
- The public GA4 ID is configured in the Astro layout: `G-V28JFQXH9Q`.
- To override the GA4 ID without another code edit, set `PUBLIC_GA4_MEASUREMENT_ID=G-...` in Netlify.
- Optionally set `PUBLIC_GOOGLE_ADS_ID=AW-...` for the Google Ads tag.
- Changes to the Astro layout or Netlify environment variables require a redeploy.
- No Google Tag Manager (GTM-) container is installed through this integration. Do not add an overlapping `gtm.js` snippet.
- Cookiebot is the CMP. The Google Consent Mode v2 **default is denied**
  before Cookiebot loads. The Google tag is loaded only if the relevant
  Cookiebot category is granted (statistics for GA4, marketing for Ads).
- The Astro site sends GA4 `page_view` via Google tag configuration and
  the existing `view_item` and `add_to_cart` events through
  `sottoTrackingEvents`. No purchase event is sent here.
- Never add a second GA4/GTM tag for the same ID without checking for duplicates.

## Shopify checkout
- In Shopify, use the official **Google & YouTube** sales channel to connect
  the same GA4 property and Google Ads account and measure `purchase`
  after checkout. Configure Shopify consent/customer privacy separately.
- Verify campaign attribution across `sottoilsole.de` and the Shopify-hosted
  checkout, including cross-domain measurement/linker and click IDs.
- Mark exactly one Purchase conversion action as primary in Google Ads.
  Verify value, currency, transaction ID, and no duplicated purchase events
  using a controlled test order.
- Do not treat a successful past Meta/Shopify test order as proof that Google
  purchase measurement is working.

## Validation before advertising
1. With no Cookiebot consent: no Google tag request, no GA4/Ads events.
2. Statistics accepted: GA4 page_view + view_item on a product page.
3. Marketing accepted: Ads tag loads; Consent Mode ad_storage,
   ad_user_data and ad_personalization become granted.
4. Add a product to cart: GA4 add_to_cart fires once after success.
5. Start checkout and place a test order: Shopify produces only one Purchase
   conversion with correct value and currency in the intended Google account.
6. Validate using Google Tag Assistant, GA4 DebugView, and Google Ads conversion diagnostics.
7. Draft disclosures for Google Analytics are included in BOTH German and Italian privacy notices;
   review the wording with your legal/privacy adviser before activation.
   If Google Ads tracking is activated later, update both disclosures accordingly.
