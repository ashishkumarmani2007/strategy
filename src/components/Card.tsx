import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'none' | 'blue' | 'coral' | 'green' | 'amber';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  interactive = false,
  className = '',
  ...props
}) => {
  const glowStyles = {
    none: '',
    blue: 'border-vsBlue/30 shadow-lg shadow-vsBlue/10',
    coral: 'border-vsCoral/50 shadow-xl shadow-vsCoral/20',
    green: 'border-vsGreen/40 shadow-lg shadow-vsGreen/15',
    amber: 'border-vsAmber/40 shadow-lg shadow-vsAmber/15',
  };

  const interactiveStyles = interactive
    ? 'hover:border-vsBlue/50 hover:bg-vsPanelLight/80 transition-all cursor-pointer'
    : '';

  return (
    <div
      className={`bg-vsPanel border border-white/10 rounded-2xl p-5 ${glowStyles[glow]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
