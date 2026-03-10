'use client';

import { useEffect, useState } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [localValue, onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search for products, brands..."
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EE4D37] focus:ring-1 focus:ring-[#EE4D37]/30 transition-all duration-200 shadow-sm"
            />
            {localValue && (
                <button
                    onClick={() => { setLocalValue(''); onChange(''); }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
