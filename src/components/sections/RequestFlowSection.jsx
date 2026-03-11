import { useState, useEffect } from 'react'
import Container from '../ui/Container.jsx'
import { AnimatePresence, motion } from 'framer-motion'
import SuggestedMixesSection from './SuggestedMixesSection.jsx'
import { useDeezerSearch } from '../../hooks/useDeezerSearch.js'
import { createRequest } from '../../lib/api/requests.js'
import RequestHeader from './request/RequestHeader.jsx'
import RequestLockedPanel from './request/RequestLockedPanel.jsx'
import RequestSearchPanel from './request/RequestSearchPanel.jsx'
import RequestDetailsPanel from './request/RequestDetailsPanel.jsx'
import RequestSuccessModal from './request/RequestSuccessModal.jsx'
import RequestInstallModal from './request/RequestInstallModal.jsx'
import { subscribeToPush } from '../../lib/push.js'

export default function RequestFlowSection() {
    const [isUnlocked, setIsUnlocked] = useState(false)

    // Search State
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTrack, setSelectedTrack] = useState(null)
    const [message, setMessage] = useState('')
    const [submitError, setSubmitError] = useState('')
    const [submitModal, setSubmitModal] = useState({
        isOpen: false,
        message: '',
        hint: '',
        variant: 'success',
        retrySeconds: null,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showInstall, setShowInstall] = useState(false)
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

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitError('')
        setSubmitModal((prev) => ({ ...prev, isOpen: false }))

        if (!selectedTrack) {
            setSubmitError('Izaberi pesmu.')
            return
        }

        setIsSubmitting(true)
        try {
            const result = await createRequest({
                message: message.trim(),
                track: selectedTrack,
            })
            if (result?.id) {
                subscribeToPush(result.id).catch((error) => {
                    console.warn('Push subscription failed:', error)
                })
            }
            setMessage('')
            setSelectedTrack(null)
            setSubmitModal({
                isOpen: true,
                message: 'Zahtev je uspesno poslat.',
                hint: 'Ukljuci notifikacije da bi dobio obavestenje kada tvoj zahtev bude prihvacen ili odbijen.',
                variant: 'success',
                retrySeconds: null,
            })
        } catch (err) {
            const retrySeconds = Number(err?.retrySeconds || 0)
            if (err?.status === 429) {
                setSubmitModal({
                    isOpen: true,
                    message: 'Zahtev nije poslat. Dostignut je limit od 2 zahteva na 15 minuta.',
                    hint: 'Sacekaj da vreme istekne pa posalji novi zahtev.',
                    variant: 'error',
                    retrySeconds: retrySeconds > 0 ? retrySeconds : null,
                })
                setSubmitError('')
            } else {
                const message = err?.message || 'Greska pri slanju zahteva.'
                setSubmitModal({
                    isOpen: true,
                    message,
                    hint: 'Proveri internet konekciju i pokusaj ponovo.',
                    variant: 'error',
                    retrySeconds: null,
                })
                setSubmitError('')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className={`relative z-10 min-h-[70vh] ${isUnlocked ? 'pt-4 md:pt-10' : 'pt-10 md:pt-16'}`}>
            <Container className="max-w-3xl">
                <div className="flex flex-col items-center gap-6 text-center">

                    <RequestHeader isUnlocked={isUnlocked} />

                    <AnimatePresence mode="wait">
                        {!isUnlocked ? (
                            <RequestLockedPanel onUnlock={handleUnlock} />
                        ) : (
                            <motion.div
                                key="unlocked"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-full max-w-2xl"
                            >
                                <div className="flex flex-col gap-8">
                                    <RequestSearchPanel
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        isLoading={isLoading}
                                        error={error}
                                        results={results}
                                        selectedTrack={selectedTrack}
                                        onSelectTrack={handleTrackSelect}
                                    />

                                    <RequestDetailsPanel
                                        selectedTrack={selectedTrack}
                                        onRemoveTrack={handleTrackRemove}
                                        message={message}
                                        onMessageChange={setMessage}
                                        onSubmit={handleSubmit}
                                        isSubmitting={isSubmitting}
                                        submitError={submitError}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <a
                        href="https://jovanljusic.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[16px] uppercase tracking-[0.3em] text-secondary/60 transition-colors hover:text-secondary"
                    >
                        Developed &amp; Powered by Yhn (XTY)
                    </a>
                </div>
                {isUnlocked ? <SuggestedMixesSection /> : null}
            </Container>
            <button
                type="button"
                onClick={() => setShowInstall(true)}
                className="fixed top-4 right-3 z-40 rounded-sm border border-border-strong bg-surface/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-secondary shadow-soft backdrop-blur transition hover:text-primary sm:top-5 sm:right-4 sm:px-5 sm:py-2 sm:text-[12px] sm:tracking-[0.3em]"
            >
                <span className="relative inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-70"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    Instaliraj
                </span>
            </button>
            <RequestSuccessModal
                isOpen={submitModal.isOpen}
                onClose={() => {
                    setSubmitModal((prev) => ({ ...prev, isOpen: false }))
                }}
                message={submitModal.message}
                hint={submitModal.hint}
                variant={submitModal.variant}
                retrySeconds={submitModal.retrySeconds}
            />
            <RequestInstallModal isOpen={showInstall} onClose={() => setShowInstall(false)} />

        </section>
    )
}
