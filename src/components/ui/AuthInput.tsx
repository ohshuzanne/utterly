'use client';

import { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <input
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        {...props}
      />
    </div>
  );
} 