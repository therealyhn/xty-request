export default function TextInput({
  id,
  label,
  description,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <label className="text-label text-secondary" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className="w-full rounded-xs border text-center border-border-base
         bg-background/60 px-4 py-3 text-sm text-primary outline-none 
         transition hover:border-border-strong hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/40"
        {...props}
      />
      {description ? <p className="text-sm text-secondary">{description}</p> : null}
    </div>
  );
}
