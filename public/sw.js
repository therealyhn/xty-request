self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = {}
  }

  const status = data.status || ''
  const track = data.track || {}
  const titleMap = {
    accepted: 'Zahtev prihvacen',
    declined: 'Zahtev odbijen',
  }
  const title = titleMap[status] || 'XTY Requests'
  const details = [track.title, track.artist].filter(Boolean).join(' • ')
  const body = details || 'Proveri status zahteva.'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: `request-${status}`,
      renotify: false,
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
        return clients.openWindow('/')
      }
      return undefined
    })
  )
})
