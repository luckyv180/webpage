'use client';

import { QuickFilter } from '@/types';

interface FilterChipsProps {
    activeFilters: QuickFilter[];
    onToggle: (filter: QuickFilter) => void;
}

const filters: { id: QuickFilter; label: string }[] = [
    { id: 'highest', label: 'Highest Commission' },
    { id: 'above10', label: 'Commission > 10%' },
];

export default function FilterChips({ activeFilters, onToggle }: FilterChipsProps) {
    return (
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
            {filters.map((filter) => {
                const isActive = activeFilters.includes(filter.id);
                return (
                    <button
                        key={filter.id}
                        onClick={() => onToggle(filter.id)}
                        className={`filter-pill ${isActive ? 'active' : ''}`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}
