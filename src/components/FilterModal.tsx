'use client';

import { useState, useEffect } from 'react';
import { Platform } from '@/types';
import { useProducts } from '@/context/ProductContext';

export type SortOption = 'default' | 'commission-high' | 'commission-low' | 'price-high' | 'price-low';
export type PriceRange = 'all' | 'under200' | '200to500' | '500to1000' | 'above1000';

export interface FilterState {
    sort: SortOption;
    priceRange: PriceRange;
    brands: string[];
    platforms: Platform[];
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onApply: (filters: FilterState) => void;
}

const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'default', label: 'Relevance' },
    { id: 'commission-high', label: 'Commission: High to Low' },
    { id: 'commission-low', label: 'Commission: Low to High' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
];

const priceRanges: { id: PriceRange; label: string }[] = [
    { id: 'all', label: 'All Prices' },
    { id: 'under200', label: 'Under ₹200' },
    { id: '200to500', label: '₹200 – ₹500' },
    { id: '500to1000', label: '₹500 – ₹1,000' },
    { id: 'above1000', label: 'Above ₹1,000' },
];



type FilterSection = 'sort' | 'price' | 'brands' | 'platforms';

export default function FilterModal({ isOpen, onClose, filters, onApply }: FilterModalProps) {
    const { allBrands, allPlatforms } = useProducts();
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);
    const [activeSection, setActiveSection] = useState<FilterSection>('sort');

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);
            setActiveSection('sort');
        }
    }, [isOpen, filters]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSortChange = (sort: SortOption) => {
        setLocalFilters(prev => ({ ...prev, sort }));
    };

    const handlePriceChange = (priceRange: PriceRange) => {
        setLocalFilters(prev => ({ ...prev, priceRange }));
    };

    const handleBrandToggle = (brand: string) => {
        setLocalFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand],
        }));
    };

    const handlePlatformToggle = (platform: Platform) => {
        setLocalFilters(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform],
        }));
    };

    const handleClearAll = () => {
        setLocalFilters({ sort: 'default', priceRange: 'all', brands: [], platforms: [] });
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const activeFilterCount = (
        (localFilters.sort !== 'default' ? 1 : 0) +
        (localFilters.priceRange !== 'all' ? 1 : 0) +
        localFilters.brands.length +
        localFilters.platforms.length
    );

    const sections: { id: FilterSection; label: string }[] = [
        { id: 'sort', label: 'Sort by' },
        { id: 'price', label: 'Price Range' },
        { id: 'brands', label: 'Brands' },
        { id: 'platforms', label: 'Platforms' },
    ];

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 z-50 overlay-enter" onClick={onClose} />

            {/* Modal — Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 top-[10vh] bg-white rounded-t-2xl shadow-2xl z-50 flex flex-col bottom-sheet-enter max-w-[480px] w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body — Left sidebar sections + right content */}
                <div className="flex flex-1 min-h-0">
                    {/* Left nav */}
                    <div className="w-[120px] shrink-0 border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-3 py-3.5 text-xs font-medium transition-colors cursor-pointer ${activeSection === section.id
                                    ? 'text-[#EE4D37] bg-white border-l-3 border-[#EE4D37]'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {section.label}
                                {section.id === 'sort' && localFilters.sort !== 'default' && (
                                    <span className="block text-[10px] text-[#EE4D37] font-normal mt-0.5 truncate">
                                        {sortOptions.find(s => s.id === localFilters.sort)?.label}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right content */}
                    <div className="flex-1 p-3 overflow-y-auto">
                        {/* Sort by */}
                        {activeSection === 'sort' && (
                            <div className="space-y-0.5">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSortChange(option.id)}
                                        className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full text-left"
                                    >
                                        <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 ${localFilters.sort === option.id ? 'border-[#EE4D37]' : 'border-gray-300'
                                            }`}>
                                            {localFilters.sort === option.id && (
                                                <div className="w-2 h-2 rounded-full bg-[#EE4D37]" />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-800">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Price Range */}
                        {activeSection === 'price' && (
                            <div className="space-y-0.5">
                                {priceRanges.map((range) => (
                                    <button
                                        key={range.id}
                                        onClick={() => handlePriceChange(range.id)}
                                        className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full text-left"
                                    >
                                        <div className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 ${localFilters.priceRange === range.id ? 'border-[#EE4D37]' : 'border-gray-300'
                                            }`}>
                                            {localFilters.priceRange === range.id && (
                                                <div className="w-2 h-2 rounded-full bg-[#EE4D37]" />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-800">{range.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Brands */}
                        {activeSection === 'brands' && (
                            <div className="space-y-0.5">
                                {allBrands.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => handleBrandToggle(brand)}
                                        className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full text-left"
                                    >
                                        <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center shrink-0 transition-colors ${localFilters.brands.includes(brand) ? 'bg-[#EE4D37] border-[#EE4D37]' : 'border-gray-300'
                                            }`}>
                                            {localFilters.brands.includes(brand) && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-800">{brand}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Platforms */}
                        {activeSection === 'platforms' && (
                            <div className="space-y-0.5">
                                {allPlatforms.map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() => handlePlatformToggle(platform as Platform)}
                                        className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full text-left"
                                    >
                                        <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center shrink-0 transition-colors ${localFilters.platforms.includes(platform as Platform) ? 'bg-[#EE4D37] border-[#EE4D37]' : 'border-gray-300'
                                            }`}>
                                            {localFilters.platforms.includes(platform as Platform) && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-800">{platform}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white shrink-0 safe-bottom">
                    <button
                        onClick={handleClearAll}
                        className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        Clear all{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 bg-[#EE4D37] text-white text-xs font-semibold rounded-lg hover:bg-[#dc3f2c] transition-colors cursor-pointer"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
}
