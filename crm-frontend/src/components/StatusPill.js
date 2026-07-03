import React from 'react';

export default function StatusPill({ status }) {
  if (!status) return null;
  const cls = `status-pill status-${status.toLowerCase()}`;
  const label = status.replace(/_/g, ' ');
  return (
    <span className={cls}>
      <span className="dot" />
      {label}
    </span>
  );
}
