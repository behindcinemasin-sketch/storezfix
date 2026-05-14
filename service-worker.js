// StorezFix Service Worker v3
const CACHE = 'sf-v3';

const PAGES = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/shopify-speed.html',
  '/google-business.html',
  '/merchant-center.html',
  '/tiktok-shop.html',
  '/schema-markup.html',
  '/ai-chatbot.html',
  '/thank-you.html',
  '/blog/',
  '/blog/index.html',
  '/blog/shopify-speed-slow.html',
  '/blog/shopify-pagespeed-score.html',
  '/blog/shopify-core-web-vitals.html',
  '/blog/google-business-profile-setup.html',
  '/blog/business-not-showing-google-maps.html',
  '/blog/connect-shopify-tiktok-shop.html',
  '/blog/what-is-schema-markup.html',
  '/blog/get-star-ratings-google-search.html',
  '/blog/google-merchant-center-shopify-setup.html',
  '/blog/ai-chatbot-small-business-website.html',
];

// Install — cache all pages
self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(PAGES).catch(function() {});
    })
  );
});

// Activate — delete ALL old caches immediately
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return res;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
