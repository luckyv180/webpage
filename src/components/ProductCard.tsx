'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, Platform } from '@/types';

interface ProductCardProps {
    product: Product;
    selectedPlatform?: Platform | null;
}

export default function ProductCard({ product, selectedPlatform }: ProductCardProps) {
    const bestPlatform = [...product.platforms].sort((a, b) => (b.commission + b.extraCommission) - (a.commission + a.extraCommission))[0];

    const href = selectedPlatform
        ? `/product/${product.id}?platform=${selectedPlatform}`
        : `/product/${product.id}`;

    return (
        <Link href={href} className="block group">
            <div className="bg-white rounded-xl overflow-hidden border border-transparent hover:border-gray-100">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="50vw"
                    />
                </div>

                {/* Product Info */}
                <div className="p-2.5">
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                        <h3 className="font-semibold text-[13px] leading-snug text-gray-900 line-clamp-1 group-hover:text-[#EE4D37] transition-colors">
                            {product.name}
                        </h3>
                        {/* Max commission badge */}
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold text-white bg-[#267E3E] shrink-0">
                            {bestPlatform.commission + bestPlatform.extraCommission}%
                            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </span>
                    </div>

                    {/* Category & Brand */}
                    <p className="text-[11px] text-gray-500 mb-1 truncate">
                        {product.category}, {product.brand}
                    </p>

                    {/* Platform count */}
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 text-[10px]">{product.platforms.length} {product.platforms.length === 1 ? 'platform' : 'platforms'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
