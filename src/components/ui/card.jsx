// components/ui/card.jsx
import React from 'react';

export function Card({ className, children, ...props }) {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props} />
  );
}