import { useMemo, useState } from 'react'
import Container from '../ui/Container.jsx'
import Chip from '../ui/Chip.jsx'
import Panel from '../ui/Panel.jsx'
import Button from '../ui/Button.jsx'
import TextInput from '../ui/TextInput.jsx'
import { useAdminQueue } from '../../hooks/useAdminQueue.js'

const STATUS_LABELS = {
  new: 'New',
  played: 'Played',
  declined: 'Declined',
}

export default function AdminQueueSection() {
  const [status, setStatus] = useState('new')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const { items, isLoading, error, reload, updateStatus } = useAdminQueue({
    username: credentials.username,
    password: credentials.password,
    status,
  })

  const totalLabel = useMemo(() => items.length, [items.length])

  return (
    <section className="relative z-10 pb-16 pt-12 md:pt-16">
      <Container className="max-w-5xl">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Chip>ADMIN QUEUE</Chip>
              <span className="h-px w-24 bg-border-light" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-h2 font-semibold tracking-tight">XTY REQUESTS</h1>
              <p className="text-body text-secondary">
                Upravljanje redom zahteva. Označi pesme kao odsvirane ili odbijene.
              </p>
            </div>
          </div>

          <Panel className="p-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  id="admin-user"
                  label="Admin user"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(event) => setUsernameInput(event.target.value)}
                />
                <TextInput
                  id="admin-pass"
                  label="Admin pass"
                  placeholder="Password"
                  type="password"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {Object.keys(STATUS_LABELS).map((key) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className={status === key ? 'border-border-strong' : ''}
                    onClick={() => setStatus(key)}
                  >
                    {STATUS_LABELS[key]}
                  </Button>
                ))}
                <Button variant="ghost" onClick={reload}>
                  Refresh
                </Button>
                <Button
                  onClick={() =>
                    setCredentials({
                      username: usernameInput.trim(),
                      password: passwordInput,
                    })
                  }
                >
                  Connect
                </Button>
              </div>

              {error && credentials.username ? (
                <div className="rounded-surface border border-border-light bg-background/40 p-4 text-body text-secondary">
                  Admin auth failed or server unavailable.
                </div>
              ) : null}

              {isLoading ? (
                <div className="rounded-surface border border-border-light bg-background/40 p-4 text-body text-secondary">
                  Loading...
                </div>
              ) : null}

              {!isLoading && !items.length ? (
                <div className="rounded-surface border border-border-light bg-background/40 p-6 text-body text-secondary">
                  Trenutno nema zahteva u redu.
                </div>
              ) : null}

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-surface border border-border-light bg-background/40 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-body font-medium text-primary">
                          {item.track_title}
                        </span>
                        <span className="text-body text-secondary">
                          {item.track_artist} · {item.track_album}
                        </span>
                        <span className="text-label text-secondary">
                          {item.nickname}
                        </span>
                      </div>
                      <span className="text-label text-secondary">
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </div>
                    {item.message ? (
                      <p className="text-body text-secondary">{item.message}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => updateStatus(item.id, 'played')}
                      >
                        Played
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => updateStatus(item.id, 'declined')}
                      >
                        Declined
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border-light pt-4 text-body text-secondary">
                <span>Ukupno: {totalLabel}</span>
                <span>Poslednje osveženje: —</span>
              </div>
            </div>
          </Panel>
        </div>
      </Container>
    </section>
  )
}
