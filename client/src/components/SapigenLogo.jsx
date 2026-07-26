export default function SapigenLogo({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sapigen Biologix"
    >
      <defs>
        <linearGradient id="sapigen-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef9fe" />
          <stop offset="1" stopColor="#afe6fc" />
        </linearGradient>
        <linearGradient id="sapigen-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e57f84" />
          <stop offset="1" stopColor="#bf548f" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="20" fill="url(#sapigen-bg)" />
      <circle cx="60" cy="46" r="27" fill="#ffffff" opacity="0.82" />
      <path
        d="M62 18c-2 14-10 24-22 32 10 2 18 10 22 22 4-12 12-20 22-22-12-8-20-18-22-32z"
        fill="url(#sapigen-mark)"
      />
      <text
        x="60"
        y="88"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
        fill="#2f5061"
      >
        SAPIGEN
      </text>
      <text
        x="60"
        y="102"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="7"
        letterSpacing="2.5"
        fill="#6a8490"
      >
        BIOLOGIX
      </text>
    </svg>
  );
}
