import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../ui/Container.jsx'
import Panel from '../ui/Panel.jsx'
import Button from '../ui/Button.jsx'
import TextInput from '../ui/TextInput.jsx'
import { useAdminQueue } from '../../hooks/useAdminQueue.js'
import logo from '../../assets/xty-logo.png'

const STATUS_TABS = [
  { id: 'all', label: 'Sve' },
  { id: 'new', label: 'Novo' },
  { id: 'accepted', label: 'Prihvaćeno' },
  { id: 'played', label: 'Pušteno' },
  { id: 'declined', label: 'Odbijeno' },
]

const STATUS_STYLES = {
  new: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  accepted: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  played: 'bg-green-500/10 text-green-300 border-green-500/20',
  declined: 'bg-red-500/10 text-red-300 border-red-500/20',
}

const STATUS_LABELS = {
  new: 'Novo',
  accepted: 'Prihvaćeno',
  played: 'Pušteno',
  declined: 'Odbijeno',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || 'border-border-light text-secondary'}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function ActionButton({ onClick, colorClass, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center gap-2 rounded-sm border border-transparent bg-cover px-3 py-1.5 transition-all hover:bg-white/5 disabled:opacity-50 ${colorClass}`}
      title={label}
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  )
}

// Simple Inline Icons
const Icons = {
  Check: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Play: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  X: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Refresh: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  ),
  User: (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

export default function AdminQueueSection() {
  const [status, setStatus] = useState('all')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [hiddenActions, setHiddenActions] = useState(() => new Set())

  const { items, isLoading, error, lastSuccess, reload, updateStatus } = useAdminQueue({
    username: credentials.username,
    password: credentials.password,
    status,
  })

  // Filter here on the client for smoother transitions if the API returns all
  // But strictly follow the status prop if the API handles it.
  // Assuming the hook handles filtering or returns all based on implementation.
  // The original code filtered on client based on hook return.
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

  const hideActionsFor = (id) => {
    setHiddenActions((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return (
    <section className="relative z-10 pb-20 pt-12 md:pt-16">
      <Container className="max-w-4xl">
        <div className="flex flex-col items-center gap-10">

          {/* Header */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-950/20 px-3 py-1 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-green-400">ADMIN ACCESS</span>
            </div>

            <div className="group relative">
              <div className="absolute -inset-8 rounded-full bg-white/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
              <img
                src={logo}
                alt="XTY logo"
                className="relative h-16 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-500 sm:h-20"
              />
            </div>

            <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl">
              Upravljanje Zahtevima
            </h1>
          </div>

          {!isUnlocked ? (
            <Panel className="w-full max-w-[400px] border-border-light/50 bg-surface/80 p-8 backdrop-blur-xl">
              <div className="flex flex-col gap-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-secondary ml-1">Username</label>
                    <TextInput
                      id="admin-user"
                      value={usernameInput}
                      onChange={(event) => setUsernameInput(event.target.value)}
                      className="bg-black/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-secondary ml-1">Password</label>
                    <TextInput
                      id="admin-pass"
                      type="password"
                      value={passwordInput}
                      onChange={(event) => setPasswordInput(event.target.value)}
                      className="bg-black/20"
                    />
                  </div>
                </div>

                <Button
                  className="w-full justify-center"
                  onClick={() =>
                    setCredentials({
                      username: usernameInput.trim(),
                      password: passwordInput,
                    })
                  }
                >
                  LOG IN
                </Button>

                {error && credentials.username && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-sm border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-200"
                  >
                    Pristup odbijen. Proverite podatke.
                  </motion.div>
                )}
              </div>
            </Panel>
          ) : (
            <div className="flex w-full flex-col gap-6">

              {/* Controls Bar */}
              <div className="sticky top-4 z-20 flex flex-col gap-4 rounded-xl border border-white/5 bg-[#0A0A0A]/80 p-2 shadow-2xl backdrop-blur-xl transition-all md:flex-row md:items-center md:justify-between">

                {/* Segmented Control */}
                <div className="flex flex-1 overflow-x-auto rounded-lg bg-white/5 p-1 no-scrollbar">
                  {STATUS_TABS.map((tab) => {
                    const isActive = status === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStatus(tab.id)}
                        className={`relative flex-1 whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${isActive
                          ? 'bg-primary text-black shadow-lg'
                          : 'text-secondary hover:text-white'
                          }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Refresh Button */}
                <button
                  onClick={reload}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icons.Refresh className={isLoading ? 'animate-spin' : ''} />
                  <span>Osveži</span>
                </button>
              </div>

              {/* Stats / Info */}
              <div className="flex items-center justify-between px-2 text-xs text-secondary">
                <span>Prikazano: <strong className="text-white">{totalLabel}</strong></span>
                <span>Status: <span className="text-green-400">Connected</span></span>
              </div>

              {/* Request List */}
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#111111] p-0 transition-colors hover:border-white/10"
                    >
                      {/* Gradient Hover Effect */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">

                        {/* Left: Song Info */}
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5 ">
                          <div className="flex items-center gap-3 mb-1">
                            <StatusBadge status={item.status} />
                            <span className="text-[10px] text-secondary/60 font-mono hidden sm:inline-block">ID: #{item.id.toString().slice(-4)}</span>
                          </div>

                          <h3 className="line-clamp-1 text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors">
                            {item.track_title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-2 text-sm text-secondary/80">
                            <span className="font-medium text-white/80">{item.track_artist}</span>
                            <span className="h-1 w-1 rounded-full bg-border-strong opacity-50" />
                            <span className="italic opacity-70">{item.track_album}</span>
                          </div>

                          {item.message && (
                            <div className="mt-2 text-xs italic text-secondary/70 border-l-2 border-primary/20 pl-2">
                              "{item.message}"
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-secondary">
                              <Icons.User className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-white/60">
                              {item.nickname}
                            </span>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 flex-row gap-2 pt-2 sm:flex-col sm:items-end sm:pt-0">
                          {/* Only show actions for 'new' or applicable statuses to reduce clutter if needed, 
                              but admin might want to change status regardless. Keeping all. */}

                          <div className="flex items-center gap-2 rounded-lg bg-black/20 p-1">
                            {!hiddenActions.has(item.id) ? (
                              <>
                                <ActionButton
                                  onClick={() => {
                                    hideActionsFor(item.id)
                                    updateStatus(item.id, 'accepted')
                                  }}
                                  colorClass="text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20"
                                  icon={<Icons.Check />}
                                  label="Prihvati"
                                />
                                <div className="h-4 w-px bg-white/10" />
                                <ActionButton
                                  onClick={() => {
                                    hideActionsFor(item.id)
                                    updateStatus(item.id, 'played')
                                  }}
                                  colorClass="text-green-400 hover:bg-green-500/10 hover:border-green-500/20"
                                  icon={<Icons.Play />}
                                  label="Pusti"
                                />
                                <div className="h-4 w-px bg-white/10" />
                                <ActionButton
                                  onClick={() => {
                                    hideActionsFor(item.id)
                                    updateStatus(item.id, 'declined')
                                  }}
                                  colorClass="text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                                  icon={<Icons.X />}
                                  label="Odbij"
                                />
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!isLoading && !filteredItems.length && (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 py-16 text-secondary">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-secondary/40">
                      <span className="text-xl">?</span>
                    </div>
                    <p>Nema zahteva u ovoj kategoriji.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
