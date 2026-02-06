self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = {}
  }

  const brand = 'XTY - SviZaPultom.app'
  const status = data.status || ''
  const track = data.track || {}
  const titleMap = {
    accepted: 'Zahtev prihvaćen',
    declined: 'Zahtev odbijen',
  }
  const title = brand
  const details = [track.title, track.artist].filter(Boolean).join(' • ')
  const body = `${titleMap[status] || 'Status'}${details ? ` • ${details}` : ''}`

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: `request-${status}`,
      renotify: false,
      icon: '/icon-512.png',
      badge: '/favicon.png',
      image: '/icon-512.png',
      data: { url: '/' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification?.data?.url || '/')
      }
      return undefined
    })
  )
})
