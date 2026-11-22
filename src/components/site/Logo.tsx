export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="var(--color-primary)" />
      <path
        d="M20 13.5c-2.6-1.9-6-2.6-9.5-2.2v15.4c3.5-.4 6.9.3 9.5 2.2 2.6-1.9 6-2.6 9.5-2.2V11.3c-3.5-.4-6.9.3-9.5 2.2Z"
        fill="var(--color-surface)"
      />
      <path d="M20 13.5v15.4" stroke="var(--color-accent)" strokeWidth="1.4" />
      <circle cx="20" cy="8.6" r="1.6" fill="var(--color-accent)" />
    </svg>
  );
}
