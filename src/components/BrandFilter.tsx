'use client';

import { Brand } from '@/types';
import { useProducts } from '@/context/ProductContext';

interface BrandFilterProps {
    selectedBrands: Brand[];
    onToggle: (brand: Brand) => void;
}

export default function BrandFilter({ selectedBrands, onToggle }: BrandFilterProps) {
    const { allBrands } = useProducts();
    return (
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
            {allBrands.map((brand) => {
                const isActive = selectedBrands.includes(brand as Brand);
                return (
                    <button
                        key={brand}
                        onClick={() => onToggle(brand as Brand)}
                        className={`filter-pill ${isActive ? 'active' : ''}`}
                    >
                        {brand}
                    </button>
                );
            })}
        </div>
    );
}
