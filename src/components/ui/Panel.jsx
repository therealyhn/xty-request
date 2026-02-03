export default function Panel({ children, className = '' }) {
  return (
    <div
      className={`rounded-surface border border-border-base bg-surface/80 shadow-soft backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
