export function Logo({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Abstract bridge/arch mark */}
      <path d="M4 20 L4 12 Q4 4 12 4 Q20 4 20 12 L20 20" />
      <path d="M9 20 L9 14 Q9 10 12 10 Q15 10 15 14 L15 20" />
    </svg>
  );
}
