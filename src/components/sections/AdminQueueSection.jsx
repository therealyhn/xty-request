import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Container from '../ui/Container.jsx'
import { useAdminQueue } from '../../hooks/useAdminQueue.js'
import AdminHeader from './admin/AdminHeader.jsx'
import AdminLoginPanel from './admin/AdminLoginPanel.jsx'
import AdminControlsBar from './admin/AdminControlsBar.jsx'
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

  const { items, isLoading, error, lastSuccess, reload, updateStatus } = useAdminQueue({
    username: credentials.username,
    password: credentials.password,
    status,
  })

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

  return (
    <section className="relative z-10 pb-20 pt-12 md:pt-16">
      <Container className="max-w-4xl">
        <div className="flex flex-col items-center gap-10">
          <AdminHeader />

          {!isUnlocked ? (
            <AdminLoginPanel
              usernameInput={usernameInput}
              passwordInput={passwordInput}
              onUsernameChange={(event) => setUsernameInput(event.target.value)}
              onPasswordChange={(event) => setPasswordInput(event.target.value)}
              onConnect={handleConnect}
              showError={Boolean(error && credentials.username)}
            />
          ) : (
            <div className="flex w-full flex-col gap-6">
              <AdminControlsBar
                status={status}
                onStatusChange={setStatus}
                onReload={reload}
                isLoading={isLoading}
              />

              <AdminStatsBar total={totalLabel} />

              <div className="flex flex-col gap-3">
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
    </section>
  )
}
