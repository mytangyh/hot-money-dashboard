// components/ui/badge.jsx
import React from 'react';

export function Badge({ variant = "default", className, ...props }) {
  const variants = {
    default: "bg-primary",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80",
    destructive: "bg-destructive",
    outline: "border border-input",
  };

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${variants[variant]} ${className}`} {...props} />
  );
}