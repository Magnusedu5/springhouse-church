interface DoveIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function DoveIcon({ className, style }: DoveIconProps) {
  return (
    <svg viewBox="0 0 64 40" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M2 22c8-9 19-13 29-9 4-9 15-11 21-6-6 0-9 4-11 7 8 2 15 7 19 13-10-4-19-3-27 3-6-8-18-10-31-8z" />
    </svg>
  );
}
