import TextInput from '../ui/TextInput.jsx'

export default function DeezerSearchInput() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-semibold">Search Deezer</h2>
        <span className="text-label text-secondary">Live search</span>
      </div>
      <TextInput
        id="deezer-search"
        label="Track name or artist"
        placeholder="Type a song title or artist"
        description="Results update as you type."
      />
    </div>
  )
}
