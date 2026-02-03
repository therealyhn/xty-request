import TextInput from '../ui/TextInput.jsx'

export default function DeezerSearchInput({ value, onChange, isLoading, disabled }) {
  return (
    <div className="flex flex-col gap-6 p-10">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-semibold uppercase">Pronadji svoju pesmu</h2>
      </div>
      <div className="relative">
        <TextInput
          id="deezer-search"
          placeholder="Ukucaj naziv pesme ili izvođača"
          description="Rezultati se ažuriraju dok kucaš."
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
