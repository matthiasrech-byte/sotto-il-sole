/* SOTTO IL SOLE - Consent-gated Meta Pixel on the Astro storefront.
   Shopify checkout Pixel/Purchase remain exclusively managed by Shopify.
   No Meta request is initiated until Cookiebot marketing consent is true.
*/
(function () {
  'use strict';

  if (window.__sottoMetaBridgeInstalled) return;
  window.__sottoMetaBridgeInstalled = true;

  var PIXEL_ID = '1457311519234543';
  var pixelStarted = false;
  var viewContentSent = false;
  var marketingWasAllowed = false;
  var trackEvents = window.sottoTrackingEvents = window.sottoTrackingEvents || [];

  function hasMarketingConsent() {
    return !!(window.Cookiebot && window.Cookiebot.consent && window.Cookiebot.consent.marketing === true);
  }

  function startMetaPixel() {
    if (pixelStarted || !hasMarketingConsent()) return;

    // Avoid interfering with a separately installed pixel. This site should
    // only use this bridge on Astro; Shopify manages its own checkout pixel.
    if (window.fbq && !window.__sottoMetaBridgeOwnsPixel) {
      console.warn('[SOTTO Meta] Another Meta Pixel is present. Skipping this bridge to prevent duplicate tracking.');
      return;
    }

    if (!window.fbq) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.__sottoMetaBridgeOwnsPixel = true;
    }

    window.fbq('init', PIXEL_ID);
    pixelStarted = true;
    window.fbq('trackSingle', PIXEL_ID, 'PageView');
  }

  function fireStorefrontEvent(entry) {
    if (!hasMarketingConsent() || !entry || !pixelStarted) return;
    if (entry.event !== 'view_item' && entry.event !== 'add_to_cart') return;

    var ecommerce = entry.ecommerce || {};
    var item = ecommerce.items && ecommerce.items[0];
    if (!item) return;
    if (entry.event === 'view_item' && viewContentSent) return;

    var params = {
      currency: ecommerce.currency || 'EUR',
      content_type: 'product'
    };
    if (item.item_id !== undefined && item.item_id !== null && String(item.item_id)) {
      params.content_ids = [String(item.item_id)];
    }
    if (item.item_name) params.content_name = String(item.item_name);
    if (typeof ecommerce.value === 'number' && Number.isFinite(ecommerce.value)) {
      params.value = ecommerce.value;
    }
    if (entry.event === 'add_to_cart') {
      var qty = Number(item.quantity);
      if (Number.isFinite(qty) && qty > 0) {
        params.contents = [{ id: String(item.item_id || ''), quantity: qty }];
      }
    }

    if (entry.event === 'view_item') {
      viewContentSent = true;
      window.fbq('trackSingle', PIXEL_ID, 'ViewContent', params);
    } else {
      window.fbq('trackSingle', PIXEL_ID, 'AddToCart', params);
    }
  }

  // Only replay the currently visible product on consent (not earlier
  // add-to-cart actions that took place while consent was denied).
  function fireCurrentProductView() {
    if (!pixelStarted || viewContentSent) return;
    for (var i = trackEvents.length - 1; i >= 0; i--) {
      if (trackEvents[i] && trackEvents[i].event === 'view_item') {
        fireStorefrontEvent(trackEvents[i]);
        return;
      }
    }
  }

  function syncConsent() {
    var allowed = hasMarketingConsent();
    if (!allowed) {
      if (marketingWasAllowed) {
        // A previously loaded Meta library cannot be safely unloaded; a
        // reload ensures no further auto events occur after revocation.
        window.location.reload();
      }
      return;
    }

    marketingWasAllowed = true;
    startMetaPixel();
    fireCurrentProductView();
  }

  // This array is already populated by the existing product scripts.
  // Observe future additions without altering their dataLayer logic.
  var originalPush = trackEvents.push;
  trackEvents.push = function () {
    var newLength = originalPush.apply(this, arguments);
    if (hasMarketingConsent()) {
      syncConsent();
      for (var i = 0; i < arguments.length; i++) {
        fireStorefrontEvent(arguments[i]);
      }
    }
    return newLength;
  };

  window.addEventListener('CookiebotOnConsentReady', syncConsent);
  window.addEventListener('CookiebotOnAccept', syncConsent);
  window.addEventListener('CookiebotOnDecline', syncConsent);
  // If Cookiebot's consent event fired before this footer script loaded,
  // its current consent status is still available here.
  syncConsent();
})();
