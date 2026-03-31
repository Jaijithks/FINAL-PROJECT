import { RainStatus } from '../lib/supabase';
import { AlertTriangle, CloudRain, Droplet } from 'lucide-react';

interface StatusBadgeProps {
  status: RainStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: Droplet,
      label: 'NORMAL',
      animation: 'hover:scale-110'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: CloudRain,
      label: 'MODERATE',
      animation: 'hover:scale-110 animate-pulse-slow'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: AlertTriangle,
      label: 'HIGH',
      animation: 'hover:scale-110 animate-pulse'
    }
  };

  const { bg, text, border, icon: Icon, label, animation } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${bg} ${text} ${border} ${animation} transform transition-all duration-300 shadow-sm`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
