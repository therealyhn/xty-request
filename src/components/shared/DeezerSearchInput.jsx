import TextInput from '../ui/TextInput.jsx'

export default function DeezerSearchInput({ value, onChange, isLoading, disabled }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-center">
        <h2 className="text-center text-h4 font-semibold uppercase md:text-h3">Pronadji svoju pesmu</h2>
      </div>
      <div className="relative">
        <TextInput
          id="deezer-search"
          placeholder="Ukucaj naziv pesme ili izvođača"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {isLoading && (
          <div className="absolute right-4 top-[12px] md:top-[42px] h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>
    </div>
  )
}
