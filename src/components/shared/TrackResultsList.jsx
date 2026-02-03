import { motion } from 'framer-motion'

export default function TrackResultsList({ tracks, onSelect }) {
    if (!tracks || tracks.length === 0) return null

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-label text-secondary">Search Results</h3>
            <ul className="max-h-80 overflow-y-auto rounded-surface border border-border-light bg-surface/30 p-2 backdrop-blur-sm">
                {tracks.map((track) => (
                    <motion.li
                        key={track.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group relative flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5 active:bg-white/10"
                        onClick={() => onSelect(track)}
                    >
                        {/* Album Art */}
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-surface">
                            {track.album?.cover_medium && (
                                <img
                                    src={track.album.cover_medium}
                                    alt={track.album.title}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            )}
                        </div>

                        {/* Track Info */}
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-body font-medium text-primary">
                                {track.title}
                            </span>
                            <span className="truncate text-label text-secondary">
                                {track.artist?.name}
                            </span>
                        </div>

                        {/* Select Action */}
                        <div className="opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-label font-bold text-green-500">SELECT</span>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    )
}
