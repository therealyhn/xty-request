export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-surface border px-6 py-3 text-body font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

  const variants = {
    primary:
      'border-border-strong bg-primary text-background hover:bg-primary/90 active:bg-primary/80',
    ghost:
      'border-border-base bg-transparent text-primary hover:bg-surface/70 active:bg-surface',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}
