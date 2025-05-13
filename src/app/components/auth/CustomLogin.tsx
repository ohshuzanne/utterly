'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AuthCheckbox } from '@/components/ui/AuthCheckbox';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function CustomLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error || 'Failed to login');
      }

      // redirects to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2">Login</h2>
      <p className="text-gray-600 mb-6">Login to continue testing.</p>
      
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="E-mail"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <AuthInput
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center justify-between mb-6">
          <AuthCheckbox
            label="Remember me"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          
          <Link 
            href="/forgot-password"
            className="text-sm text-purple-600 hover:text-purple-500"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </AuthButton>
      </form>

      <div className="mt-6 text-center text-gray-600 text-sm">
        Not a user? <Link href="/register" className="text-purple-600 hover:text-purple-500">Sign up here</Link>.
      </div>
    </div>
  );
} 