'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import EmployerSelection from '@/components/EmployerSelection';
import { EmployerData } from '@/types/employer';
import { API_BASE_URL } from '@/config/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showEmployerSelection, setShowEmployerSelection] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First try employer login
      const employerResponse = await fetch(
        `${API_BASE_URL}/auth/backOffice-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: email, password }),
        },
      );

      const employerData = await employerResponse.json();
      if (employerResponse.ok) {
        console.log('employerData', employerData);
        // Store employers data
        localStorage.setItem('employers', JSON.stringify(employerData || []));
        // Show employer selection popup
        setShowEmployerSelection(true);
        return;
      }

      // If employer login fails, try employee login
      const employeeResponse = await fetch(
        `${API_BASE_URL}/auth/portal-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userName: email, password }),
        },
      );

      const employeeData = await employeeResponse.json();

      if (employeeResponse.ok) {
        const user = {
          ...employeeData?.profile,
          role: 'employee' as const,
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', employeeData.accessToken);
        localStorage.setItem('refreshToken', employeeData.refreshToken);

        // Check if there's a return URL stored
        const returnToJob = localStorage.getItem('returnToJob');
        if (returnToJob) {
          localStorage.removeItem('returnToJob'); // Clean up
          router.push(`/find-job/${returnToJob}?apply=true`);
        } else {
          router.push('/dashboard');
        }
      } else {
        // Show error message
        console.error(
          'Login failed:',
          employeeData.message || 'Invalid credentials',
        );
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleEmployerSelect = async (employer: EmployerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/backOffice-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: email,
          password: password,
          orgId: employer.tenant.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data with role as employer and selected employer
        const userData = {
          ...data.profile,
          role: 'employer',
          selectedEmployer: employer,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        // Close the popup and redirect to dashboard
        setShowEmployerSelection(false);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseEmployerSelection = () => {
    setShowEmployerSelection(false);
    // Clear all auth-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left: Login Form */}
      <div className='w-full lg:w-1/2'>
        <div className='flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-32 py-12 bg-white'>
          <div className='mb-8 flex items-center gap-2'>
            <span className='inline-block bg-blue-100 p-2 rounded-full'>
              <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                <rect width='24' height='24' rx='6' fill='#2563EB' />
                <path
                  d='M8 17v-1a4 4 0 0 1 8 0v1'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <circle
                  cx='12'
                  cy='9'
                  r='4'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
            <span className='text-xl font-semibold text-gray-900'>
              <Link href='/'>TalentHub</Link>
            </span>
          </div>
          <h2 className='text-2xl font-bold mb-2'>Sign In</h2>
          <p className='mb-6 text-gray-600 text-sm'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='text-blue-600 font-medium hover:underline'
            >
              Create Account
            </Link>
          </p>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              placeholder='Email address or Phone number'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
              required
            />
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200'
                required
              />
              <button
                type='button'
                className='absolute right-2 top-2 text-gray-400'
                onClick={() => setShowPassword((v) => !v)}
              >
                <svg width='20' height='20' fill='none' viewBox='0 0 20 20'>
                  <path
                    d='M10 4.167c-4.167 0-7.5 3.333-7.5 5.833s3.333 5.833 7.5 5.833 7.5-3.333 7.5-5.833-3.333-5.833-7.5-5.833Zm0 9.166a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666Z'
                    stroke='#9CA3AF'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <input
                  id='remember'
                  type='checkbox'
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className='h-4 w-4 border rounded'
                />
                <label htmlFor='remember' className='text-sm text-gray-600'>
                  Remember me
                </label>
              </div>
              <Link
                href='/forgot-password'
                className='text-blue-600 text-sm font-medium hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <Button type='submit' className='w-full mt-2'>
              Sign In
            </Button>
          </form>
          <div className='flex items-center my-4'>
            <div className='flex-grow h-px bg-gray-200' />
            <span className='mx-2 text-gray-400 text-sm'>or</span>
            <div className='flex-grow h-px bg-gray-200' />
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='w-1/2 h-20 flex items-center justify-center gap-2'
            >
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <g clipPath='url(#clip0_88_102)'>
                  <path
                    d='M19.805 10.23c0-.68-.06-1.36-.18-2.02H10.2v3.83h5.44a4.64 4.64 0 0 1-2.01 3.05v2.54h3.25c1.9-1.75 2.93-4.33 2.93-7.4Z'
                    fill='#4285F4'
                  />
                  <path
                    d='M10.2 20c2.7 0 4.97-.89 6.63-2.41l-3.25-2.54c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.13H1.25v2.59A10 10 0 0 0 10.2 20Z'
                    fill='#34A853'
                  />
                  <path
                    d='M4.61 11.88a5.99 5.99 0 0 1 0-3.76V5.53H1.25a10 10 0 0 0 0 8.94l3.36-2.59Z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M10.2 3.96c1.47 0 2.78.51 3.81 1.5l2.85-2.85C15.17.89 12.9 0 10.2 0A10 10 0 0 0 1.25 5.53l3.36 2.59c.79-2.37 2.99-4.13 5.59-4.13Z'
                    fill='#EA4335'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_88_102'>
                    <rect width='20' height='20' fill='#fff' />
                  </clipPath>
                </defs>
              </svg>
              Sign in with Google
            </Button>
            <Button
              variant='outline'
              className='w-1/2 h-20 flex items-center justify-center gap-2'
            >
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M20 10.061C20 4.505 15.523 0 10 0S0 4.505 0 10.061c0 5.018 3.657 9.167 8.438 9.878v-6.99H5.898v-2.888h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C16.343 19.228 20 15.079 20 10.06Z'
                  fill='#1877F2'
                />
                <path
                  d='M13.656 12.948l.443-2.888h-2.773V8.185c0-.791.388-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89v1.386H5.898v2.888h2.54v6.99a10.07 10.07 0 0 0 1.562.121c.53 0 1.05-.042 1.562-.121v-6.99h2.094Z'
                  fill='#fff'
                />
              </svg>
              Sign in with Facebook
            </Button>
          </div>
        </div>
      </div>
      {/* Right: Stats & BG */}
      <div className='hidden lg:block w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-gray-700 relative clip-path-diagonal'>
        <style jsx>{`
          .clip-path-diagonal {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%);
          }
        `}</style>
        <div className='absolute inset-0 grid grid-cols-3 grid-rows-4 gap-0 opacity-30'>
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`bg-gray-${i % 2 === 0 ? '600' : '200'} w-full h-full`}
            />
          ))}
        </div>
        <div className='relative z-10 text-center'>
          <h2 className='text-3xl font-semibold text-white mb-4'>
            Over 1,75,324 candidates
            <br />
            waiting for good employees.
          </h2>
          <div className='flex justify-center gap-8 mt-8'>
            <div className='flex flex-col items-center'>
              <span className='text-white text-xl font-bold'>1,75,324</span>
              <span className='text-gray-300 text-sm mt-1'>Live Job</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-white text-xl font-bold'>97,354</span>
              <span className='text-gray-300 text-sm mt-1'>Companies</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-white text-xl font-bold'>7,532</span>
              <span className='text-gray-300 text-sm mt-1'>New Jobs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employer Selection Modal */}
      {showEmployerSelection && (
        <EmployerSelection
          employers={JSON.parse(localStorage.getItem('employers') || '[]')}
          onSelect={handleEmployerSelect}
          isOpen={showEmployerSelection}
          onClose={handleCloseEmployerSelection}
        />
      )}
    </div>
  );
}
