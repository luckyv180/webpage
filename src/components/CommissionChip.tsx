'use client';

import { Platform } from '@/types';

interface CommissionChipProps {
    platform: Platform;
    commission: number;
    isBest?: boolean;
    isEmphasized?: boolean;
    size?: 'sm' | 'md';
}

const platformColors: Record<Platform, { text: string; bg: string; border: string }> = {
    Amazon: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    Flipkart: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    Meesho: { text: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200' },
};

const platformIcons: Record<Platform, string> = {
    Amazon: '🛒',
    Flipkart: '📦',
    Meesho: '🛍️',
};

export default function CommissionChip({ platform, commission, isBest, isEmphasized, size = 'sm' }: CommissionChipProps) {
    const colors = platformColors[platform];
    const icon = platformIcons[platform];
    const isSmall = size === 'sm';

    return (
        <span
            className={`
        inline-flex items-center gap-1 rounded-lg font-medium border transition-all
        ${isSmall ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'}
        ${isBest
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : isEmphasized
                        ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1 ring-${platform === 'Amazon' ? 'amber' : platform === 'Flipkart' ? 'blue' : 'pink'}-300/50`
                        : `${colors.bg} ${colors.text} ${colors.border}`
                }
      `}
        >
            <span className={isSmall ? 'text-xs' : 'text-sm'}>{icon}</span>
            {platform} {commission}%
            {isBest && <span className="text-xs">⭐</span>}
        </span>
    );
}
