'use client';

import { Platform } from '@/types';

type ViewMode = 'all' | Platform;

interface PlatformToggleProps {
    activeView: ViewMode;
    onChange: (view: ViewMode) => void;
}

const platforms: { id: ViewMode; label: string }[] = [
    { id: 'all', label: 'All Platforms' },
    { id: 'Amazon', label: 'Amazon' },
    { id: 'Flipkart', label: 'Flipkart' },
    { id: 'Meesho', label: 'Meesho' },
];

export default function PlatformToggle({ activeView, onChange }: PlatformToggleProps) {
    return (
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1">
            {platforms.map((platform) => {
                const isActive = activeView === platform.id;
                return (
                    <button
                        key={platform.id}
                        onClick={() => onChange(platform.id)}
                        className={`filter-pill ${isActive ? 'active' : ''}`}
                    >
                        {platform.label}
                    </button>
                );
            })}
        </div>
    );
}
