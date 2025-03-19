'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BrandingSidebar } from '@/components/ui/BrandingSidebar';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verify the token is valid before showing the form
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setError('Invalid or missing reset token');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-token?token=${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          setIsTokenValid(false);
          setError(data.error || 'Invalid or expired token');
          return;
        }
        
        setIsTokenValid(true);
      } catch {
        // No need to use the error variable
        setIsTokenValid(false);
        setError('Error verifying token');
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate the password
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Reset error:', data);
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Reset error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-green-800 mb-2 font-medium">Password reset successful!</p>
          <p className="text-green-700 text-sm">
            Your password has been updated. You can now log in with your new password.
          </p>
          <div className="mt-4">
            <Link href="/login" className="text-purple-600 hover:text-purple-500">
              Go to login
            </Link>
          </div>
        </div>
      );
    }

    if (isTokenValid === false) {
      return (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-800 mb-2 font-medium">Invalid or expired reset link</p>
          <p className="text-red-700 text-sm">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="mt-4">
            <Link href="/forgot-password" className="text-purple-600 hover:text-purple-500">
              Request a new reset link
            </Link>
          </div>
        </div>
      );
    }

    if (isTokenValid === null) {
      return (
        <div className="p-4 text-center">
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="New Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <AuthInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </AuthButton>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex">
      <BrandingSidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your new password below.
          </p>

          {renderContent()}
        </div>
      </div>
    </div>
  );
} 