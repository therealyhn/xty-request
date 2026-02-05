import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Container from '../ui/Container.jsx'
import { useAdminQueue } from '../../hooks/useAdminQueue.js'
import { fetchNightCode, updateNightCode } from '../../lib/api/admin.js'
import AdminHeader from './admin/AdminHeader.jsx'
import AdminLoginPanel from './admin/AdminLoginPanel.jsx'
import AdminControlsBar from './admin/AdminControlsBar.jsx'
import AdminStatsBar from './admin/AdminStatsBar.jsx'
import AdminEmptyState from './admin/AdminEmptyState.jsx'
import AdminRequestCard from './admin/AdminRequestCard.jsx'
import Panel from '../ui/Panel.jsx'
import Button from '../ui/Button.jsx'

export default function AdminQueueSection() {
  const [status, setStatus] = useState('all')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [forceShowActions, setForceShowActions] = useState(() => new Set())
  const [nightCode, setNightCode] = useState('')
  const [nightCodeStatus, setNightCodeStatus] = useState('')

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

  useEffect(() => {
    const loadNightCode = async () => {
      if (!credentials.username || !credentials.password) return
      try {
        const code = await fetchNightCode({
          username: credentials.username,
          password: credentials.password,
        })
        setNightCode(code)
      } catch {
        setNightCode('')
      }
    }
    if (isUnlocked) {
      loadNightCode()
    }
  }, [isUnlocked, credentials])

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

  const handleSaveNightCode = async () => {
    setNightCodeStatus('')
    try {
      await updateNightCode({
        username: credentials.username,
        password: credentials.password,
        nightCode: nightCode.trim(),
      })
      setNightCodeStatus('saved')
    } catch {
      setNightCodeStatus('error')
    }
  }

  const handleGenerateNightCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setNightCode(code)
    setNightCodeStatus('')
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

              <Panel className="w-full border-border-light/50 bg-surface/80 p-4 backdrop-blur-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="text-xs font-medium text-secondary">Night Code</label>
                    <input
                      type="text"
                      value={nightCode}
                      onChange={(event) => setNightCode(event.target.value)}
                      className="w-full rounded-sm border border-border-base bg-black/20 px-3 py-2 text-sm text-primary outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
                      placeholder="Upiši ili generiši kod"
                    />
                    {nightCodeStatus === 'saved' ? (
                      <span className="text-xs text-green-400">Sačuvano.</span>
                    ) : null}
                    {nightCodeStatus === 'error' ? (
                      <span className="text-xs text-red-400">Greška pri čuvanju.</span>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={handleGenerateNightCode}>
                      Generate
                    </Button>
                    <Button onClick={handleSaveNightCode}>
                      Save
                    </Button>
                  </div>
                </div>
              </Panel>

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
