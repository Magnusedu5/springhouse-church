import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  variant?: 'default' | 'red';
}

export default function StatCard({ icon: Icon, label, value, variant = 'default' }: StatCardProps) {
  const isRed = variant === 'red';
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isRed ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-blue/10 text-brand-blue'
        }`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div>
        <p className={`text-2xl font-semibold ${isRed ? 'text-brand-red' : 'text-brand-blue'}`}>
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
