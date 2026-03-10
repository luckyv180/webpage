'use client';

import { useState, useMemo, useCallback } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Platform } from '@/types';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterModal, { FilterState, PriceRange } from '@/components/FilterModal';

type ViewMode = 'all' | Platform;

export default function Home() {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ViewMode>('all');
  const [highestCommission, setHighestCommission] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sort: 'default',
    priceRange: 'all',
    brands: [],
    platforms: [],
  });

  const activeFilterCount = (
    (filters.sort !== 'default' ? 1 : 0) +
    (filters.priceRange !== 'all' ? 1 : 0) +
    filters.brands.length +
    filters.platforms.length
  );

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const platformButtons: { id: ViewMode; label: string }[] = [
    { id: 'all', label: 'All Platforms' },
    { id: 'Amazon', label: 'Amazon' },
    { id: 'Flipkart', label: 'Flipkart' },
    { id: 'Meesho', label: 'Meesho' },
  ];

  const getMinPrice = (product: typeof products[0]): number => {
    return Math.min(...product.platforms.map(p => p.price));
  };

  const priceFilter = (product: typeof products[0], range: PriceRange): boolean => {
    const minPrice = getMinPrice(product);
    switch (range) {
      case 'under200': return minPrice < 200;
      case '200to500': return minPrice >= 200 && minPrice <= 500;
      case '500to1000': return minPrice >= 500 && minPrice <= 1000;
      case 'above1000': return minPrice > 1000;
      default: return true;
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Brand filter from modal
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Platform filter from modal
    if (filters.platforms.length > 0) {
      result = result.filter(p =>
        p.platforms.some(pl => filters.platforms.includes(pl.platform))
      );
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      result = result.filter(p => priceFilter(p, filters.priceRange));
    }

    // Platform view toggle — filter to products on that platform
    if (activeView !== 'all') {
      result = result.filter(p => p.platforms.some(pl => pl.platform === activeView));
    }

    // Highest commission quick filter — sort by max commission
    if (highestCommission) {
      result.sort((a, b) => {
        const aMax = Math.max(...a.platforms.map(p => p.commission + p.extraCommission));
        const bMax = Math.max(...b.platforms.map(p => p.commission + p.extraCommission));
        return bMax - aMax;
      });
    }

    // Sort from modal (overrides highest commission sort if set)
    switch (filters.sort) {
      case 'commission-high':
        result.sort((a, b) => {
          const aMax = Math.max(...a.platforms.map(p => p.commission + p.extraCommission));
          const bMax = Math.max(...b.platforms.map(p => p.commission + p.extraCommission));
          return bMax - aMax;
        });
        break;
      case 'commission-low':
        result.sort((a, b) => {
          const aMax = Math.max(...a.platforms.map(p => p.commission + p.extraCommission));
          const bMax = Math.max(...b.platforms.map(p => p.commission + p.extraCommission));
          return aMax - bMax;
        });
        break;
      case 'price-low':
        result.sort((a, b) => getMinPrice(a) - getMinPrice(b));
        break;
      case 'price-high':
        result.sort((a, b) => getMinPrice(b) - getMinPrice(a));
        break;
    }

    return result;
  }, [searchQuery, activeView, highestCommission, filters]);

  const totalProducts = products.length;
  const displayedProducts = filteredProducts.length;
  const hasFilters = searchQuery || activeFilterCount > 0 || highestCommission || activeView !== 'all';

  return (
    <div>

      {/* Search hero */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="px-3 py-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[68px] z-40">
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {/* Filters button — opens modal */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`filter-pill flex items-center gap-1.5 ${activeFilterCount > 0 ? 'active' : ''}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-[#EE4D37] text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Platform toggles */}
          {platformButtons.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActiveView(platform.id)}
              className={`filter-pill ${activeView === platform.id ? 'active' : ''}`}
            >
              {platform.label}
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Highest Commission quick pill */}
          <button
            onClick={() => setHighestCommission(!highestCommission)}
            className={`filter-pill ${highestCommission ? 'active' : ''}`}
          >
            Highest Commission
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="px-3 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {activeView !== 'all' ? `Best on ${activeView}` : 'All Products'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {displayedProducts} of {totalProducts} products
            </p>
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ sort: 'default', priceRange: 'all', brands: [], platforms: [] });
                setHighestCommission(false);
                setActiveView('all');
              }}
              className="text-xs text-[#EE4D37] hover:underline cursor-pointer font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Product Grid — 2 cols on mobile strictly */}
        {displayedProducts > 0 ? (
          <div className="product-grid grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selectedPlatform={activeView !== 'all' ? (activeView as Platform) : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-base font-semibold text-gray-700">No products found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
