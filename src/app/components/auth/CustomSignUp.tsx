'use client';

import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  position: string;
  company: string;
  accountPurpose: string;
  experienceLevel: string;
  termsAccepted: boolean;
}

export default function CustomSignUp() {
  const { isLoaded, signUp } = useSignUp();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    company: "",
    accountPurpose: "",
    experienceLevel: "",
    termsAccepted: false,
  });
  const [error, setError] = useState("");

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            position: formData.position,
            company: formData.company,
            accountPurpose: formData.accountPurpose,
            experienceLevel: formData.experienceLevel,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save additional details");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 mt-[10px]">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName" className="mt-[10px]"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName" className="mt-[10px]"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="position">Position/Job Title</Label>
          <Input
            id="position" className="mt-[10px]"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company" className="mt-[10px]"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="accountPurpose">What are you using this account for?</Label>
          <select
            id="accountPurpose"
            className="w-full rounded-md border border-gray-300 p-2 mt-[10px]"
            value={formData.accountPurpose}
            onChange={(e) => setFormData({ ...formData, accountPurpose: e.target.value })}
            required
          >
            <option value="">Select a purpose</option>
            <option value="testing">Testing my chatbot</option>
            <option value="development">Developing chatbots</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="experienceLevel">Experience Level</Label>
          <select
            id="experienceLevel"
            className="w-full rounded-md border border-gray-300 p-2 mt-[10px]"
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            required
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner (0-2 years of experience)</option>
            <option value="intermediate">Intermediate (2-4 years of experience)</option>
            <option value="advanced">Advanced (4-6 years of experience)</option>
            <option value="expert">Expert (6+ years of experience)</option>
          </select>
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="mt-[10px]"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="mt-[20px]">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="mt-[10px]"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

          <div className="flex items-center space-x-2 mt-[40px]">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, termsAccepted: checked as boolean })
            }
          />
          <Label htmlFor="terms">
            I have read and consent to the terms and conditions
          </Label>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-800 text-white"
          disabled={!formData.termsAccepted}
        >
          Get Started
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already a user? <a href="/login" className="text-purple-800 hover:text-purple-500">Login here</a>
        </p>
      </div>
    </form>
  );
} 