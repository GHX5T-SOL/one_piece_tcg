import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link className="brand-mark" href="/" aria-label="OP CPT home">
      <svg className="brand-mark__icon" viewBox="0 0 96 96" role="img" aria-label="OP CPT compass card mark">
        <defs>
          <linearGradient id="op-cpt-gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f8df8c" />
            <stop offset="0.5" stopColor="#d4af37" />
            <stop offset="1" stopColor="#8a641f" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="40" fill="#081d2a" stroke="url(#op-cpt-gold)" strokeWidth="4" />
        <path d="M48 9l8 31 31 8-31 8-8 31-8-31-31-8 31-8z" fill="#0fa3a6" opacity="0.82" />
        <rect x="33" y="25" width="30" height="46" rx="4" fill="#f2e9d6" stroke="#d4af37" strokeWidth="3" />
        <rect x="38" y="33" width="20" height="27" rx="2" fill="#081d2a" stroke="#0fa3a6" strokeWidth="2" />
        <path d="M20 72c9-12 16-18 25-18 8 0 13 5 20 18z" fill="#071014" />
        <path d="M18 73h60" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="brand-mark__text">
        <strong>OP CPT</strong>
        {!compact && <em>Cape Town TCG Community</em>}
      </span>
    </Link>
  );
}
