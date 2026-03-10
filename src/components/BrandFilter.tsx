'use client';

import { useProducts } from '@/context/ProductContext';

interface BrandFilterProps {
    selectedBrands: string[];
    onToggle: (brand: string) => void;
}

export default function BrandFilter({ selectedBrands, onToggle }: BrandFilterProps) {
    const { allBrands } = useProducts();
    return (
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
            {allBrands.map((brand) => {
                const isActive = selectedBrands.includes(brand);
                return (
                    <button
                        key={brand}
                        onClick={() => onToggle(brand)}
                        className={`filter-pill ${isActive ? 'active' : ''}`}
                    >
                        {brand}
                    </button>
                );
            })}
        </div>
    );
}
