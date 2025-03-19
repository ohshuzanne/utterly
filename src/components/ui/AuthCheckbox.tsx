'use client';

import { InputHTMLAttributes } from 'react';

interface AuthCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthCheckbox({ label, ...props }: AuthCheckboxProps) {
  return (
    <div className="mb-4 flex items-start">
      <div className="flex h-5 items-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="text-gray-700">{label}</label>
      </div>
    </div>
  );
} 