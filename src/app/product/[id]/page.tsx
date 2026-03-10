'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import CopyLinkButton from '@/components/CopyLinkButton';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: PageProps) {
    const { products } = useProducts();
    const { id } = use(params);
    const searchParams = useSearchParams();
    const platformFilter = searchParams.get('platform');
    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
                <div className="text-5xl sm:text-6xl mb-4">😵</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Not Found</h2>
                <p className="text-gray-500 mt-2 text-sm">The product you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#EE4D37] text-white rounded-lg hover:bg-[#dc3f2c] transition-colors font-semibold text-sm">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    const bestPlatform = [...product.platforms].sort((a, b) => (b.commission + b.extraCommission) - (a.commission + a.extraCommission))[0];

    // Filter platforms if context was passed from homepage
    let sortedPlatforms = [...product.platforms].sort((a, b) => (b.commission + b.extraCommission) - (a.commission + a.extraCommission));
    if (platformFilter && sortedPlatforms.some(p => p.platform === platformFilter)) {
        sortedPlatforms = sortedPlatforms.filter(p => p.platform === platformFilter);
    }

    // Platform brand colors
    const platformMeta: Record<string, { color: string }> = {
        'Amazon': { color: '#ff9900' },
        'Flipkart': { color: '#2874f0' },
        'Meesho': { color: '#e83e8c' },
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Mobile back button */}
            <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>
            </div>

            {/* ─── Main section ─── */}
            <div className="px-3 py-4">
                <div className="flex flex-col gap-5">

                    {/* Product Image */}
                    <div>
                        <div className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="relative aspect-square">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        {/* Product Title */}
                        <h1 className="text-lg font-bold text-gray-900 leading-snug">
                            {product.name}
                        </h1>

                        {/* ─── CashKaro-style: "Choose the best platform" ─── */}
                        <div className="mt-6">
                            <h3 className="text-base font-bold text-gray-900 mb-3">Choose the best price</h3>

                            {/* Mobile: stack cards vertically strictly */}
                            <div className="flex flex-col gap-3.5">
                                {sortedPlatforms.map((p) => {
                                    const isBest = p.platform === bestPlatform.platform;
                                    const meta = platformMeta[p.platform];
                                    const platformCommPercent = p.commission;
                                    const extraCommPercent = p.extraCommission;
                                    const totalCommPercent = platformCommPercent + extraCommPercent;
                                    const platformCommAmount = Math.round(p.price * platformCommPercent / 100);
                                    const extraCommAmount = Math.round(p.price * extraCommPercent / 100);
                                    const totalEarning = platformCommAmount + extraCommAmount;

                                    return (
                                        <div
                                            key={p.platform}
                                            className={`rounded-xl border-2 p-4 transition-all relative ${isBest
                                                ? 'border-[#EE4D37] shadow-md bg-orange-50/20'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            {/* Best badge */}
                                            {isBest && (
                                                <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-[#EE4D37] text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                                                    Best Deal
                                                </div>
                                            )}

                                            {/* Platform name + info icon */}
                                            <div className="flex items-center justify-between mb-3 mt-1">
                                                <span className="text-lg font-bold" style={{ color: meta.color }}>
                                                    {p.platform}
                                                </span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>

                                            {/* Price row */}
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Seller Price</span>
                                                <span className="text-sm font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                                            </div>

                                            {/* Platform Commission row */}
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">{p.platform} Commission <span className="text-xs text-gray-400 font-normal">({platformCommPercent}%)</span></span>
                                                <span className="text-sm font-bold text-gray-900">₹{platformCommAmount.toLocaleString()}</span>
                                            </div>

                                            {/* Extra Commission row */}
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Extra Commission <span className="text-xs text-gray-400 font-normal">({extraCommPercent}%)</span></span>
                                                <span className="text-sm font-bold text-gray-900">₹{extraCommAmount.toLocaleString()}</span>
                                            </div>

                                            {/* Total Earning */}
                                            <div className="flex items-center justify-between py-2 mb-3">
                                                <span className="text-sm font-bold text-[#EE4D37]">Total Earning</span>
                                                <span className="text-sm font-bold text-[#EE4D37]">₹{totalEarning.toLocaleString()} <span className="text-xs opacity-80 font-normal">({totalCommPercent}%)</span></span>
                                            </div>

                                            {/* CTA */}
                                            <CopyLinkButton link={p.link} platform={p.platform} variant="full" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-8 border-t border-gray-200 pt-5">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">About this item</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Product info table */}
                        <div className="mt-5 border-t border-gray-200 pt-4 mb-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2.5 pr-4 text-gray-500 font-medium w-[100px]">Seller</td>
                                        <td className="py-2.5 text-gray-900 font-medium">{sortedPlatforms.map(p => p.platform).join(', ')}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2.5 pr-4 text-gray-500 font-medium">Brand</td>
                                        <td className="py-2.5 text-gray-900">{product.brand}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2.5 pr-4 text-gray-500 font-medium">Category</td>
                                        <td className="py-2.5 text-gray-900">{product.category}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
