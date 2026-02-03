import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../ui/Container.jsx'
import DeezerSearchInput from '../shared/DeezerSearchInput.jsx'
import TrackResultsList from '../shared/TrackResultsList.jsx'
import SelectedTrackCard from '../shared/SelectedTrackCard.jsx'
import RequestForm from '../shared/RequestForm.jsx'
import logo from '../../assets/xty-logo.png'
import { useDeezerSearch } from '../../hooks/useDeezerSearch.js'

export default function RequestFlowSection() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrack, setSelectedTrack] = useState(null)
  const { results, isLoading, error } = useDeezerSearch(searchQuery, {
    debounceMs: 500,
    limit: 10,
  })

  useEffect(() => {
    const unlocked = localStorage.getItem('xty_request_unlocked')
    if (unlocked === 'true') {
      setIsUnlocked(true)
    }
  }, [])

  const handleUnlock = () => {
    window.open('https://www.instagram.com/xty.music/', '_blank')
    localStorage.setItem('xty_request_unlocked', 'true')
    setIsUnlocked(true)
  }

  const handleTrackSelect = (track) => {
    setSelectedTrack(track)
    setSearchQuery('') // Optional: clear query
  }

  const handleTrackRemove = () => {
    setSelectedTrack(null)
  }

  return (
    <section className="relative z-10 min-h-screen pb-24 pt-16 md:pt-24">
      <Container className="max-w-3xl">
        <div className="flex flex-col items-center gap-12 text-center">

          {/* Header Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 rounded-sm border border-border-base bg-surface/50 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-label font-bold tracking-widest text-secondary">LIVE REQUEST</span>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/5 opacity-0 blur-2xl transition-opacity duration-500 hover:opacity-10" />
              <img
                src={logo}
                alt="XTY logo"
                className="relative h-24 w-auto drop-shadow-glow md:h-32"
                width={200}
                height={100}
              />
            </div>

            <h1 className="bg-text-glow bg-clip-text text-center font-heading text-5xl font-bold tracking-tighter text-transparent sm:text-7xl md:text-8xl">
              NARUČI PESMU
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {!isUnlocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex w-full max-w-md flex-col gap-6"
              >
                <div className="relative overflow-hidden rounded-sm border border-border-base bg-surface p-8 text-center shadow-2xl">
                  {/* Decorative gradients */}
                  <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 bg-purple-500/20 blur-[100px]" />

                  <div className="relative z-10 flex flex-col gap-6">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-primary">ZAPRATI NAS</h3>
                      <p className="text-body text-secondary">
                        Da bi mogao/la da naručiš pesmu, potrebno je da zapratiš našu stranicu.
                      </p>
                    </div>

                    <button
                      onClick={handleUnlock}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xs bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] active:scale-[0.98]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="relative z-10 h-6 w-6"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span className="relative z-10">XTY MUSIC</span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>

                    <p className="text-[11px] uppercase tracking-widest text-secondary/50">
                      Klikni da otključaš pretragu
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-2xl"
              >
                <div className="flex flex-col gap-8">
                  {/* Search Section */}
                  <div className="rounded-sm border border-border-base bg-surface/50 p-1 backdrop-blur-xl">
                    <div
                      className={`transition-all duration-300 ${
                        selectedTrack ? 'pointer-events-none opacity-50 blur-[2px]' : ''
                      }`}
                    >
                      <DeezerSearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        isLoading={isLoading}
                        disabled={!!selectedTrack}
                      />
                    </div>

                    {/* Results List */}
                    <div className="mt-2 text-left">
                      <TrackResultsList
                        tracks={results}
                        onSelect={handleTrackSelect}
                      />
                      {error ? (
                        <p className="mt-3 text-body text-secondary">
                          Search failed. Try again.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Dynamic Content */}
                  <div className="flex flex-col gap-8">
                    <SelectedTrackCard
                      track={selectedTrack}
                      onRemove={handleTrackRemove}
                    />

                    {/* Request Form - Blurred until track selected */}
                    <div className={`transition-all duration-500 ${selectedTrack ? 'opacity-100' : 'pointer-events-none opacity-40 blur-[2px]'}`}>
                      <RequestForm />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </Container>
    </section>
  )
}
