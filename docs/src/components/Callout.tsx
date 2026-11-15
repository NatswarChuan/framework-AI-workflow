import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type = 'info', title, children }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />;
      case 'danger':
        return <AlertOctagon size={18} style={{ color: '#f43f5e', flexShrink: 0, marginTop: '2px' }} />;
      default:
        return <Info size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />;
    }
  };

  return (
    <div className={`callout callout-${type}`}>
      {getIcon()}
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

