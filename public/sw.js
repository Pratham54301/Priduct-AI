// Intentionally empty service worker file to avoid repeated 404 requests in dev.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
