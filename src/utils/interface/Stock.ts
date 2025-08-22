import type { IProduct } from "./Product";

export interface IStock extends IProduct {
    id: string;
    productId: string;
    total: number;
    sold: number;
    remaining: number;
    status: string;
}

export interface IOverview {
    lowStockCount: number;
    outOfStockCount: number;
    totalProducts: number;
    totalStockValue: number;
}
