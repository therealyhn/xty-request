export default function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-border-light bg-surface/70 px-3 py-1 text-[12px] uppercase tracking-[0.22em] text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
