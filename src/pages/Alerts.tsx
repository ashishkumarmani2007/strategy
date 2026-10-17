import React from 'react';
import { AlertsList } from '../features/alerts/AlertsList';

export const Alerts: React.FC = () => {
  return (
    <div className="py-6">
      <AlertsList isEmbedded={false} />
    </div>
  );
};
