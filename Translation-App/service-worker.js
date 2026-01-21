const CACHE_NAME = 'TRANSLATION_CACHE';
const assets = [
  'index.html',
  'Pages/translationScreen.html',
  'Pages/languageSelectionScreen.html',
  'Pages/savedConversationsScreen.html',
  'Pages/openedConversationScreen.html',
  'Pages/settings.html',

  'Images/Favicons/favicon.ico',
  'Images/Favicons/favicon-96x96.png',
  'Images/Favicons/site.webmanifest',
  'Images/Favicons/apple-touch-icon.png',

  'css/style.css',
  'css/bootstrap.min.css',

  'app.js',
  'js/translation.js',
  'js/bootstrap.bundle.min.js',
  'js/main.js',
  'js/conversationStorage.js',
  'js/loadConversation.js',
  'js/settings.js',
  'js/settingsPage.js',

  'Images/LynxLogo.png',
  'Images/Icons/activeMicrophone.png',
  'Images/Icons/bin.png',
  'Images/Icons/chat.png',
  'Images/Icons/error.png',
  'Images/Icons/globe.png',
  'Images/Icons/home.png',
  'Images/Icons/microphone.png',
  'Images/Icons/save.png',
  'Images/Icons/Spain.png',
  'Images/Icons/text.png',
  'Images/Icons/united-kingdom.png',
  'Images/Icons/settings.png'
];

// Install: cache all assets safely
self.addEventListener("install", (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of assets) {
        try {
          await cache.add(asset);
          console.log(`[SW] Cached: ${asset}`);
        } catch (err) {
          console.warn(`[SW] Failed to cache ${asset}:`, err);
        }
      }
    })()
  );
  self.skipWaiting(); // Activate immediately after install
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })()
  );
  self.clients.claim(); // Take control of pages immediately
});

// Fetch: respond with cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // return cached asset
      }
      return fetch(event.request) // fallback to network
        .catch(err => {
          console.warn(`[SW] Fetch failed for ${event.request.url}:`, err);
          throw err;
        });
    })
  );
});