'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  employerService,
  Employer,
  EmployersResponse,
} from '@/services/employer.service';

const orgTypes = [
  'Government',
  'Semi Government',
  'NGO',
  'Private Company',
  'International Agencies',
  'Others',
];

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className='flex justify-center items-center gap-2 mt-10'>
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full ${current === 1 ? 'bg-blue-100 text-blue-300' : 'hover:bg-blue-50 text-blue-600'}`}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <svg
          width='18'
          height='18'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M15 19l-7-7 7-7' strokeWidth='2' />
        </svg>
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`w-8 h-8 flex items-center justify-center rounded-full font-medium ${current === page ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-blue-600'}`}
          onClick={() => onChange(page)}
        >
          {page.toString().padStart(2, '0')}
        </button>
      ))}
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full ${current === total ? 'bg-blue-100 text-blue-300' : 'hover:bg-blue-50 text-blue-600'}`}
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <svg
          width='18'
          height='18'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M9 5l7 7-7 7' strokeWidth='2' />
        </svg>
      </button>
    </div>
  );
}

export default function FindEmployersPage() {
  const [radius, setRadius] = useState(32);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showRadius, setShowRadius] = useState(true);
  const [showOrgType, setShowOrgType] = useState(true);
  const [page, setPage] = useState(1);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const perPage = 3;

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await employerService.getEmployers();
        setEmployers(response.items || []);
      } catch (error) {
        console.error('Failed to fetch employers:', error);
        setEmployers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const totalPages = Math.ceil(employers.length / perPage);
  const paginatedEmployers = employers.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Page title and breadcrumb */}
      <div className='flex justify-between bg-gray-100 items-center px-16 pt-8'>
        <h2 className='text-md text-gray-500'>Find Employers</h2>
        <nav className='text-gray-400 text-sm flex items-center gap-1'>
          <span className='hover:text-gray-600 cursor-pointer'>Home</span>
          <span className='mx-1'>/</span>
          <span className='text-gray-700 font-medium'>Find Employers</span>
        </nav>
      </div>
      {/* Top search/filter bar */}
      <div className='bg-gray-100 px-16 py-4 pb-8 border-b'>
        <div className='flex gap-4 items-center shadow rounded-xl px-6 py-2 bg-white'>
          {/* Job title search */}
          <div className='flex items-center gap-2 flex-1 border-r pr-4'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
            >
              <circle cx='11' cy='11' r='7' strokeWidth='2' />
              <path d='M21 21l-4.35-4.35' strokeWidth='2' />
            </svg>
            <input
              className='flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400'
              placeholder='Job tittle, Keyword...'
            />
          </div>
          {/* Location */}
          <div className='flex items-center gap-2 border-r px-4 min-w-[200px]'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
            >
              <path
                d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                strokeWidth='2'
              />
              <circle cx='12' cy='9' r='2.5' strokeWidth='2' />
            </svg>
            <input
              className='bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 w-full'
              placeholder='Location'
            />
          </div>
          {/* Category */}
          <div className='flex items-center gap-2 border-r px-4 min-w-[200px]'>
            <svg
              width='22'
              height='22'
              fill='none'
              viewBox='0 0 24 24'
              stroke='#2563eb'
            >
              <g strokeWidth='2'>
                <rect x='3' y='3' width='18' height='6' rx='2' />
                <rect x='3' y='9' width='18' height='6' rx='2' />
                <rect x='3' y='15' width='18' height='6' rx='2' />
              </g>
            </svg>
            <select className='bg-transparent border-none outline-none text-gray-700 w-full'>
              <option>Select Category</option>
            </select>
          </div>
          {/* Chevron and Find Job button */}
          <div className='flex items-center gap-2 pl-2'>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition'>
              Find Job
            </button>
          </div>
        </div>
      </div>
      <div className='flex px-16 py-8 gap-8'>
        {/* Sidebar filter */}
        <div className='w-80 bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-fit'>
          <button className='w-full bg-blue-600 text-white py-2 rounded mb-6 font-semibold flex items-center justify-center gap-2'>
            {/* Sliders icon for filter */}
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 21V16'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M17 16H23'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M4 21V14'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M1 14H7'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 21V12'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9 8H15'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M20 12V3'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M12 8V3'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M4 10V3'
                stroke='#ffffff'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Filter
          </button>
          {/* Location Radius */}
          <div className='mb-8'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer select-none'
              onClick={() => setShowRadius((v) => !v)}
            >
              <span className='font-medium'>
                Location Radius:{' '}
                <span className='text-blue-600 font-semibold'>
                  {radius} miles
                </span>
              </span>
              <svg
                width='18'
                height='18'
                fill='none'
                viewBox='0 0 20 20'
                stroke='currentColor'
                className={`transition-transform ${showRadius ? '' : 'rotate-180'}`}
              >
                <path d='M6 8l4 4 4-4' strokeWidth='2' />
              </svg>
            </div>
            {showRadius && (
              <input
                type='range'
                min={0}
                max={100}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className='w-full accent-blue-600 mt-4'
              />
            )}
          </div>
          {/* Organization Type */}
          <div>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer select-none'
              onClick={() => setShowOrgType((v) => !v)}
            >
              <span className='font-medium'>Organization Type</span>
              <svg
                width='18'
                height='18'
                fill='none'
                viewBox='0 0 20 20'
                stroke='currentColor'
                className={`transition-transform ${showOrgType ? '' : 'rotate-180'}`}
              >
                <path d='M6 8l4 4 4-4' strokeWidth='2' />
              </svg>
            </div>
            {showOrgType &&
              orgTypes.map((type) => (
                <div key={type} className='flex items-center mb-2'>
                  <input
                    type='radio'
                    id={type}
                    name='orgType'
                    value={type}
                    checked={selectedOrg === type}
                    onChange={() => setSelectedOrg(type)}
                    className='mr-2 accent-blue-600'
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
          </div>
        </div>
        {/* Main content */}
        <div className='flex-1 rounded-lg'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex gap-2'>
              <select className='w-24 border rounded-md px-3 py-2'>
                <option>Latest</option>
                <option>Oldest</option>
              </select>
              <select className='w-36 border rounded-md px-3 py-2'>
                <option>12 per page</option>
                <option>24 per page</option>
                <option>48 per page</option>
              </select>
            </div>
            <div className='flex gap-2'>
              <button className='border rounded p-2 bg-blue-50 text-blue-600'>
                <svg
                  width='20'
                  height='20'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <rect x='3' y='3' width='7' height='7' strokeWidth='2' />
                  <rect x='14' y='3' width='7' height='7' strokeWidth='2' />
                  <rect x='14' y='14' width='7' height='7' strokeWidth='2' />
                  <rect x='3' y='14' width='7' height='7' strokeWidth='2' />
                </svg>
              </button>
              <button className='border rounded p-2'>
                <svg
                  width='20'
                  height='20'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <rect x='3' y='3' width='18' height='7' strokeWidth='2' />
                  <rect x='3' y='14' width='18' height='7' strokeWidth='2' />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            {paginatedEmployers.map((employer, idx) => (
              <div
                key={employer.name}
                className='flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-6 justify-between'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center'>
                    <span className='text-2xl font-bold text-gray-400'>
                      {employer.tradeName[0]}
                    </span>
                  </div>
                  <div>
                    <div className='font-semibold text-lg'>
                      <Link
                        href={`/find-employers/${encodeURIComponent(employer.tradeName.toLowerCase().replace(/\s+/g, '-'))}`}
                        className='hover:underline text-blue-700'
                      >
                        {employer.tradeName}
                      </Link>
                    </div>
                    <div className='flex items-center gap-4 text-gray-500 text-sm'>
                      <div className='flex items-center gap-1'>
                        <svg
                          width='16'
                          height='16'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                            strokeWidth='2'
                          />
                        </svg>
                        {employer.address.subcity}
                      </div>
                      {employer.industry && (
                        <div className='flex items-center gap-1'>
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <rect
                              x='3'
                              y='7'
                              width='18'
                              height='13'
                              rx='2'
                              strokeWidth='2'
                            />
                          </svg>
                          {employer.industry}
                        </div>
                      )}
                      {employer.companySize && (
                        <div className='flex items-center gap-1'>
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'
                              strokeWidth='2'
                            />
                            <circle cx='9' cy='7' r='4' strokeWidth='2' />
                            <path
                              d='M23 21v-2a4 4 0 00-3-3.87'
                              strokeWidth='2'
                            />
                            <path d='M16 3.13a4 4 0 010 7.75' strokeWidth='2' />
                          </svg>
                          {employer.companySize}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button className='bg-blue-100 text-blue-700 px-6 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-200 transition'>
                  View Details
                  <svg
                    width='18'
                    height='18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path d='M9 5l7 7-7 7' strokeWidth='2' />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
