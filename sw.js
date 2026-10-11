/* Lets browsers offer "Install" for GNS Kids. Nothing is cached: every page and video loads fresh. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
