import TextInput from '../ui/TextInput.jsx'

export default function DeezerSearchInput({ value, onChange, isLoading, disabled }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-semibold">Search Deezer</h2>
        <span className="text-label text-secondary">Live search</span>
      </div>
      <div className="relative">
        <TextInput
          id="deezer-search"
          label="Track name or artist"
          placeholder="Type a song title or artist"
          description="Results update as you type."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {isLoading && (
          <div className="absolute right-4 top-[42px] h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>
    </div>
  )
}
