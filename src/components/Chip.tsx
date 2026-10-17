import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, Info } from 'lucide-react';

export type ChipVariant = 'safe' | 'danger' | 'uncertain' | 'info' | 'neutral';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const defaultIcons = {
    safe: <ShieldCheck className="w-3.5 h-3.5 text-vsGreen" />,
    danger: <AlertOctagon className="w-3.5 h-3.5 text-vsCoral" />,
    uncertain: <AlertTriangle className="w-3.5 h-3.5 text-vsAmber" />,
    info: <Info className="w-3.5 h-3.5 text-vsBlue" />,
    neutral: <HelpCircle className="w-3.5 h-3.5 text-vsMuted" />,
  };

  const variantStyles = {
    safe: 'bg-vsGreen/10 text-vsGreen border-vsGreen/30',
    danger: 'bg-vsCoral/10 text-vsCoral border-vsCoral/30',
    uncertain: 'bg-vsAmber/10 text-vsAmber border-vsAmber/30',
    info: 'bg-vsBlue/10 text-vsBlue border-vsBlue/30',
    neutral: 'bg-white/5 text-vsMuted border-white/10',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon ?? defaultIcons[variant]}
      <span>{label}</span>
    </span>
  );
};
