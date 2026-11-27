// خدمة خلفية بسيطة لتطبيق لوحة الأستاذ: تجعل الصفحة قابلة للتثبيت كتطبيق،
// وتعرض آخر نسخة محفوظة إذا انقطع الإنترنت. طلبات الخادم (Google) لا تُخزَّن أبداً.
const CACHE = 'attendance-teacher-v1';
const SHELL = ['./teacher.html', './teacher.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return; // الخادم والخطوط: مباشرة من الشبكة
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request))
  );
});
