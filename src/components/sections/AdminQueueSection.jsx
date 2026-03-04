import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Container from '../ui/Container.jsx'
import { useAdminQueue } from '../../hooks/useAdminQueue.js'
import { createEvent, deleteEvent, exportRequestsPdf, fetchEvents, renameEvent, setActiveEvent } from '../../lib/api/admin.js'
import AdminHeader from './admin/AdminHeader.jsx'
import AdminLoginPanel from './admin/AdminLoginPanel.jsx'
import AdminControlsBar from './admin/AdminControlsBar.jsx'
import AdminFilterBar from './admin/AdminFilterBar.jsx'
import AdminStatsBar from './admin/AdminStatsBar.jsx'
import AdminEmptyState from './admin/AdminEmptyState.jsx'
import AdminRequestCard from './admin/AdminRequestCard.jsx'

export default function AdminQueueSection() {
  const [status, setStatus] = useState('all')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [forceShowActions, setForceShowActions] = useState(() => new Set())

  const [events, setEvents] = useState([])
  const [activeEventId, setActiveEventId] = useState(0)
  const [newEventName, setNewEventName] = useState('')
  const [renameEventName, setRenameEventName] = useState('')
  const [isEventsLoading, setIsEventsLoading] = useState(false)
  const [eventsError, setEventsError] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { items, isLoading, error, lastSuccess, reload, updateStatus } = useAdminQueue({
    username: credentials.username,
    password: credentials.password,
    status,
    eventId: activeEventId,
  })

  const loadEvents = useCallback(async () => {
    if (!credentials.username || !credentials.password) return

    setIsEventsLoading(true)
    setEventsError(null)
    try {
      const payload = await fetchEvents({
        username: credentials.username,
        password: credentials.password,
      })
      setEvents(payload.events)
      setActiveEventId(payload.activeEventId || 0)
    } catch (err) {
      setEventsError(err)
      setEvents([])
      setActiveEventId(0)
    } finally {
      setIsEventsLoading(false)
    }
  }, [credentials.username, credentials.password])

  useEffect(() => {
    if (credentials.username && credentials.password) {
      loadEvents()
    }
  }, [credentials.username, credentials.password, loadEvents])

  useEffect(() => {
    const activeEvent = events.find((eventItem) => eventItem.id === activeEventId)
    setRenameEventName(activeEvent?.name || '')
  }, [events, activeEventId])

  const filteredItems = useMemo(() => {
    if (status === 'all') return items
    return items.filter((item) => item.status === status)
  }, [items, status])

  const totalLabel = filteredItems.length

  useEffect(() => {
    if (lastSuccess) {
      setIsUnlocked(true)
    }
  }, [lastSuccess])

  const showActionsFor = (id) => {
    setForceShowActions((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const resetActionsFor = (id) => {
    setForceShowActions((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleConnect = () => {
    setCredentials({
      username: usernameInput.trim(),
      password: passwordInput,
    })
  }

  const handleCreateEvent = async () => {
    const name = newEventName.trim()
    if (!name || !credentials.username || !credentials.password) return

    setIsEventsLoading(true)
    setEventsError(null)
    try {
      const response = await createEvent({
        username: credentials.username,
        password: credentials.password,
        name,
      })
      const nextActive = Number(response.active_event_id || 0)
      setEvents(Array.isArray(response.data) ? response.data : [])
      setActiveEventId(nextActive)
      setNewEventName('')
    } catch (err) {
      setEventsError(err)
    } finally {
      setIsEventsLoading(false)
    }
  }

  const handleActiveEventChange = async (eventId) => {
    if (!eventId || !credentials.username || !credentials.password) return

    setIsEventsLoading(true)
    setEventsError(null)
    try {
      const response = await setActiveEvent({
        username: credentials.username,
        password: credentials.password,
        eventId,
      })
      const nextActive = Number(response.active_event_id || eventId)
      setEvents(Array.isArray(response.data) ? response.data : [])
      setActiveEventId(nextActive)
    } catch (err) {
      setEventsError(err)
    } finally {
      setIsEventsLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!activeEventId || !credentials.username || !credentials.password) return

    setIsEventsLoading(true)
    setEventsError(null)
    try {
      const response = await deleteEvent({
        username: credentials.username,
        password: credentials.password,
        eventId: activeEventId,
      })
      const nextActive = Number(response.active_event_id || 0)
      setEvents(Array.isArray(response.data) ? response.data : [])
      setActiveEventId(nextActive)
      setIsDeleteModalOpen(false)
    } catch (err) {
      setEventsError(err)
    } finally {
      setIsEventsLoading(false)
    }
  }

  const handleRenameEvent = async () => {
    const name = renameEventName.trim()
    if (!name || !activeEventId || !credentials.username || !credentials.password) return

    setIsEventsLoading(true)
    setEventsError(null)
    try {
      const response = await renameEvent({
        username: credentials.username,
        password: credentials.password,
        eventId: activeEventId,
        name,
      })
      const nextActive = Number(response.active_event_id || activeEventId)
      setEvents(Array.isArray(response.data) ? response.data : [])
      setActiveEventId(nextActive)
    } catch (err) {
      setEventsError(err)
    } finally {
      setIsEventsLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!activeEventId || !credentials.username || !credentials.password) return
    const activeEvent = events.find((eventItem) => eventItem.id === activeEventId)
    try {
      await exportRequestsPdf({
        username: credentials.username,
        password: credentials.password,
        eventId: activeEventId,
        eventName: activeEvent?.name || `event-${activeEventId}`,
      })
    } catch (err) {
      setEventsError(err)
    }
  }

  return (
    <section className="relative z-10 pb-20 pt-12 md:pt-16">
      <Container className="max-w-6xl">
        <div className="flex flex-col items-center gap-10">
          {!isUnlocked ? (
            <>
              <AdminHeader />
              <AdminLoginPanel
                usernameInput={usernameInput}
                passwordInput={passwordInput}
                onUsernameChange={(event) => setUsernameInput(event.target.value)}
                onPasswordChange={(event) => setPasswordInput(event.target.value)}
                onConnect={handleConnect}
                showError={Boolean(error && credentials.username)}
              />
            </>
          ) : (
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col gap-4 md:max-xl:grid md:max-xl:grid-cols-2 md:max-xl:items-start md:max-xl:gap-5">
                <AdminHeader
                  className="md:max-xl:items-start md:max-xl:text-left"
                  logoClassName="md:max-xl:h-[7.2rem]"
                />

                <AdminControlsBar
                  events={events}
                  activeEventId={activeEventId}
                  onActiveEventChange={handleActiveEventChange}
                  newEventName={newEventName}
                  onNewEventNameChange={setNewEventName}
                  onCreateEvent={handleCreateEvent}
                  renameEventName={renameEventName}
                  onRenameEventNameChange={setRenameEventName}
                  onRenameEvent={handleRenameEvent}
                  onExportPdf={handleExportPdf}
                  onDeleteEvent={() => setIsDeleteModalOpen(true)}
                  isEventsLoading={isEventsLoading}
                />
              </div>

              <AdminFilterBar
                status={status}
                onStatusChange={setStatus}
                onReload={reload}
                isLoading={isLoading}
              />

              {eventsError ? (
                <div className="rounded-sm border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {eventsError.message || 'Event operacija nije uspela. Pokusaj ponovo.'}
                </div>
              ) : null}

              <AdminStatsBar total={totalLabel} />

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredItems.map((item) => (
                    <AdminRequestCard
                      key={item.id}
                      item={item}
                      isActionsHidden={item.status !== 'new' && !forceShowActions.has(item.id)}
                      onEdit={() => showActionsFor(item.id)}
                      onAccept={() => {
                        updateStatus(item.id, 'accepted')
                        resetActionsFor(item.id)
                      }}
                      onPlay={() => {
                        updateStatus(item.id, 'played')
                        resetActionsFor(item.id)
                      }}
                      onDecline={() => {
                        updateStatus(item.id, 'declined')
                        resetActionsFor(item.id)
                      }}
                    />
                  ))}
                </AnimatePresence>

                {!isLoading && !filteredItems.length && <AdminEmptyState />}
              </div>
            </div>
          )}
        </div>
      </Container>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-md rounded-sm border border-white/10 bg-[#111111] p-5 shadow-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Potvrda brisanja eventa
            </h3>
            <p className="mt-3 text-sm text-secondary">
              Da li si siguran da zelis da obrises ovaj event? Ova akcija se ne moze ponistiti.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/10"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Odustani
              </button>
              <button
                className="rounded-xs border border-red-500/30 bg-red-500/15 px-3 py-2 text-xs font-bold uppercase tracking-wide text-red-200 hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleDeleteEvent}
                disabled={isEventsLoading}
              >
                Obrisi
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
