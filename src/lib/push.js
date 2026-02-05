import { buildApiUrl } from './api/base.js'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function isSecureContext() {
  return window.isSecureContext || window.location.hostname === 'localhost'
}

export async function subscribeToPush(requestId) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push not supported in this browser.')
      return
    }
    if (!isSecureContext()) {
      console.warn('Push requires secure context (HTTPS or localhost).')
      return
    }
    if (!requestId) {
      console.warn('Missing request id for push subscription.')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission not granted.')
      return
    }

    const base = import.meta.env.BASE_URL || '/'
    const swUrl = new URL('sw.js', window.location.origin + base)
    const swRegistration = await navigator.serviceWorker.register(swUrl)
    const existing = await swRegistration.pushManager.getSubscription()
    const subscription =
      existing ||
      (await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(await getPublicKey()),
      }))

    await fetch(buildApiUrl('/server/api/push/subscribe.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_id: requestId,
        subscription,
      }),
    })
  } catch (error) {
    console.warn('Push subscribe failed:', error)
  }
}

async function getPublicKey() {
  const response = await fetch(buildApiUrl('/server/api/push/public-key.php'))
  if (!response.ok) {
    throw new Error('Unable to fetch public key.')
  }
  const payload = await response.json()
  if (!payload?.publicKey) {
    throw new Error('Missing public key.')
  }
  return payload.publicKey
}
