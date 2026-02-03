export default function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
