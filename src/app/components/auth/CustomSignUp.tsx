'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AuthCheckbox } from '@/components/ui/AuthCheckbox';
import { AuthSelect } from '@/components/ui/AuthSelect';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  position: string;
  company: string;
  accountPurpose: string;
  experienceLevel: string;
  acceptTerms: boolean;
}

export default function CustomSignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    position: '',
    company: '',
    accountPurpose: 'testing',
    experienceLevel: 'beginner',
    acceptTerms: false,
  });

  const accountPurposeOptions = [
    { value: 'testing', label: 'Testing My Chatbot' },
    { value: 'development', label: 'Development' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' },
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // 2. Sign in the user automatically
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error || 'Failed to login after registration');
      }

      // 3. Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2">Register</h2>
      <p className="text-gray-600 mb-6">Complete your registration easily.</p>
      
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="First Name"
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        
        <AuthInput
          label="Last Name"
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Position/Job Title"
          id="position"
          name="position"
          type="text"
          value={formData.position}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Company Name"
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <AuthSelect
          label="What are you using this account for?"
          id="accountPurpose"
          name="accountPurpose"
          value={formData.accountPurpose}
          onChange={handleChange}
          options={accountPurposeOptions}
        />

        <AuthSelect
          label="Experience Level"
          id="experienceLevel"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          options={experienceLevelOptions}
        />

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

        <AuthCheckbox
          label="I have read and consent to the terms and conditions."
          id="acceptTerms"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          required
        />

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Get Started'}
        </AuthButton>
      </form>

      <div className="mt-6 text-center text-gray-600 text-sm">
        Already a user? <Link href="/login" className="text-purple-600 hover:text-purple-500">Login here</Link>.
      </div>
    </div>
  );
} 