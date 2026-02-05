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

export default function RequestFlowSection() {
    const [isUnlocked, setIsUnlocked] = useState(false)

    // Search State
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTrack, setSelectedTrack] = useState(null)
    const [nightCode, setNightCode] = useState('')
    const [message, setMessage] = useState('')
    const [submitError, setSubmitError] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitErrorModal, setSubmitErrorModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        setSubmitSuccess(false)
        setSubmitErrorModal(false)

        if (!selectedTrack) {
            setSubmitError('Izaberi pesmu.')
            return
        }

        setIsSubmitting(true)
        try {
            await createRequest({
                night_code: nightCode.trim(),
                message: message.trim(),
                track: selectedTrack,
            })
            setNightCode('')
            setMessage('')
            setSelectedTrack(null)
            setSubmitSuccess(true)
        } catch (err) {
            const message = err?.message || 'Greška pri slanju.'
            setSubmitError(message)
            if (message.toLowerCase().includes('night code')) {
                setSubmitErrorModal(true)
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
                                        nightCode={nightCode}
                                        message={message}
                                        onNightCodeChange={setNightCode}
                                        onMessageChange={setMessage}
                                        onSubmit={handleSubmit}
                                        isSubmitting={isSubmitting}
                                        submitError={submitError}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {isUnlocked ? <SuggestedMixesSection /> : null}
            </Container>
            <RequestSuccessModal
              isOpen={submitSuccess}
              onClose={() => setSubmitSuccess(false)}
              message="Zahtev je uspešno poslat."
            />
            <RequestSuccessModal
              isOpen={submitErrorModal}
              onClose={() => setSubmitErrorModal(false)}
              message="Pogrešan Kod Žurke - Pokušaj ponovo"
              variant="error"
            />
        </section>
    )
}




