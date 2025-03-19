'use client';

import { useState } from 'react';
import { BrandingSidebar } from '@/components/ui/BrandingSidebar';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <BrandingSidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your email to receive a password reset link.
          </p>

          {success ? (
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-green-800 mb-2 font-medium">Reset link sent!</p>
              <p className="text-green-700 text-sm">
                If an account with that email exists, we&apos;ve sent a link to reset your password. 
                Please check your inbox.
              </p>
              <div className="mt-4">
                <Link href="/login" className="text-purple-600 hover:text-purple-500">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <AuthInput
                label="Email"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}

              <AuthButton type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </AuthButton>

              <div className="text-center mt-4 text-sm">
                <Link href="/login" className="text-purple-600 hover:text-purple-500">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 