'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Product } from '@/types';
import { products as defaultProducts } from '@/data/products';

interface ProductContextType {
    products: Product[];
    allBrands: string[];
    allPlatforms: string[];
    allCategories: string[];
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
    const products = defaultProducts;

    const allBrands = [...new Set(products.map(p => p.brand))];
    const allPlatforms = [...new Set(products.flatMap(p => p.platforms.map(pl => pl.platform)))];
    const allCategories = [...new Set(products.map(p => p.category))];

    return (
        <ProductContext.Provider
            value={{
                products,
                allBrands,
                allPlatforms,
                allCategories,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
