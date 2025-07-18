'use client';

import Image from 'next/image';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface FormData {
  email: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ForgotPassword() {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !auth) return;

    try {
      await sendPasswordResetEmail(auth, formData.email, {
        url: `${window.location.origin}/set-new-password`, // Firebase appends oobCode here
      });
      setSubmitted(true);
    } catch (error: unknown) {
      let message = 'An error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      setErrors({ email: message });
    }
  };

  return (
    <div className="min-h-screen flex p-10">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
          </div>

          {submitted ? (
            <p className="text-sm text-green-600 text-center">
              If your email is registered, a reset link has been sent.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 border-gray-300"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#FA8800] text-white py-2 px-4 rounded-md font-medium text-sm hover:bg-gray-800 transition"
              >
                Reset your password
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <div className="relative w-full h-full object-cover">
          <Image
            src="/images/signup.png"
            alt="Forgot Password Illustration"
            fill
            className="w-full h-full object-fit"
            priority
          />
        </div>
      </div>
    </div>
  );
}
