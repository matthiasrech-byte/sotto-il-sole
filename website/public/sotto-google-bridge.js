/* SOTTO IL SOLE - consent-gated Google tracking for the Astro storefront.
   Configure PUBLIC_GA4_MEASUREMENT_ID and (optionally) PUBLIC_GOOGLE_ADS_ID.
   Shopify checkout purchase conversions MUST be tracked by Shopify's official
   Google & YouTube integration, not by this storefront script.
   No Google tag is fetched before the relevant Cookiebot consent is given.
*/
(function () {
  'use strict';

  if (window.__sottoGoogleBridgeInstalled) return;
  window.__sottoGoogleBridgeInstalled = true;

  var scriptNode = document.currentScript;
  var ga4Id = scriptNode && scriptNode.getAttribute('data-ga4-id') || '';
  var adsId = scriptNode && scriptNode.getAttribute('data-ads-id') || '';
  if (!/^G-[A-Z0-9]+$/.test(ga4Id)) ga4Id = '';
  if (!/^AW-[0-9]+$/.test(adsId)) adsId = '';
  if (!ga4Id && !adsId) return; // Nothing will be sent until real IDs are configured.

  var trackingEvents = window.sottoTrackingEvents = window.sottoTrackingEvents || [];
  var googleScriptRequested = false;
  var ga4Configured = false;
  var adsConfigured = false;
  var viewItemSent = false;
  var previousConsent = getConsent();

  function getConsent() {
    var choices = window.Cookiebot && window.Cookiebot.consent;
    return {
      statistics: !!(choices && choices.statistics === true),
      marketing: !!(choices && choices.marketing === true),
      preferences: !!(choices && choices.preferences === true)
    };
  }

  function ensureGoogleTag(id) {
    if (googleScriptRequested) return;
    googleScriptRequested = true;
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    // Cookiebot should not re-block this script: it is inserted only once
    // its corresponding consent category is already granted.
    tag.setAttribute('data-cookieconsent', 'ignore');
    document.head.appendChild(tag);
    window.gtag('js', new Date());
  }

  function getEcommerce(entry) {
    if (!entry || !entry.ecommerce || !entry.ecommerce.items) return null;
    var sourceItem = entry.ecommerce.items[0];
    if (!sourceItem || !sourceItem.item_id) return null;
    var item = {
      item_id: String(sourceItem.item_id),
      item_name: String(sourceItem.item_name || ''),
      quantity: Number(sourceItem.quantity) > 0 ? Number(sourceItem.quantity) : 1
    };
    if (sourceItem.item_brand) item.item_brand = String(sourceItem.item_brand);
    if (sourceItem.item_variant) item.item_variant = String(sourceItem.item_variant);
    if (typeof sourceItem.price === 'number' && Number.isFinite(sourceItem.price)) {
      item.price = sourceItem.price;
    }
    var result = {
      currency: entry.ecommerce.currency || 'EUR',
      items: [item],
      send_to: ga4Id
    };
    if (typeof entry.ecommerce.value === 'number' && Number.isFinite(entry.ecommerce.value)) {
      result.value = entry.ecommerce.value;
    }
    return result;
  }

  function sendEvent(entry) {
    if (!ga4Configured || !getConsent().statistics || !entry) return;
    if (entry.event !== 'view_item' && entry.event !== 'add_to_cart') return;
    if (entry.event === 'view_item' && viewItemSent) return;

    var params = getEcommerce(entry);
    if (!params) return;
    if (entry.event === 'view_item') viewItemSent = true;
    window.gtag('event', entry.event, params);
  }

  // Replay ONLY the visible product view if consent arrives after page load.
  // Never replay cart actions that happened before consent.
  function sendCurrentProductView() {
    if (!ga4Configured || viewItemSent || !getConsent().statistics) return;
    for (var i = trackingEvents.length - 1; i >= 0; i--) {
      if (trackingEvents[i] && trackingEvents[i].event === 'view_item') {
        sendEvent(trackingEvents[i]);
        break;
      }
    }
  }

  function syncConsent() {
    var consent = getConsent();
    // Already-loaded Google tags cannot be reliably unloaded in place.
    // On consent withdrawal, update Consent Mode immediately, then reload
    // to return to a no-tag state (mirrors the Meta bridge behaviour).
    var revoked = (previousConsent.statistics && !consent.statistics) ||
      (previousConsent.marketing && !consent.marketing);
    previousConsent = consent;
    // Cookiebot also integrates with Google Consent Mode; these explicit
    // updates keep this bridge in sync when consent is changed after load.
    window.gtag('consent', 'update', {
      analytics_storage: consent.statistics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      functionality_storage: consent.preferences ? 'granted' : 'denied',
      personalization_storage: consent.preferences ? 'granted' : 'denied'
    });

    if (consent.statistics && ga4Id && !ga4Configured) {
      ensureGoogleTag(ga4Id);
      ga4Configured = true;
      window.gtag('config', ga4Id); // Includes one GA4 page_view.
    }
    if (consent.marketing && adsId && !adsConfigured) {
      ensureGoogleTag(adsId);
      adsConfigured = true;
      window.gtag('config', adsId);
    }
    if (revoked) {
      window.location.reload();
      return;
    }
    sendCurrentProductView();
  }

  var originalPush = trackingEvents.push;
  trackingEvents.push = function () {
    var length = originalPush.apply(this, arguments);
    syncConsent();
    for (var i = 0; i < arguments.length; i++) sendEvent(arguments[i]);
    return length;
  };

  window.addEventListener('CookiebotOnConsentReady', syncConsent);
  window.addEventListener('CookiebotOnAccept', syncConsent);
  window.addEventListener('CookiebotOnDecline', syncConsent);
  syncConsent();
})();
