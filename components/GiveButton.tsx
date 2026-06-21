import Link from 'next/link';

interface Props {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  href?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-2.5 text-base',
  lg: 'px-10 py-3.5 text-lg',
};

const variantClasses: Record<string, string> = {
  primary: 'bg-gradient-to-br from-brand-red to-[#943E22] text-white shadow-md hover:from-[#c4633e] hover:to-[#7a3018] hover:shadow-lg transition-all duration-300',
  outline: 'bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all duration-300',
};

export default function GiveButton({
  variant = 'primary',
  size = 'md',
  label = 'Give Now',
  href = '/give',
}: Props) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex items-center justify-center rounded-full',
        'font-display uppercase tracking-widest font-semibold',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
      ].join(' ')}
    >
      {label}
    </Link>
  );
}
