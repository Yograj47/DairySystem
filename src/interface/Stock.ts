import type { IProduct } from "./Product";
import z from "zod";

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

// Zod schema
export const AddStockSchema = z.object({
    supplierName: z.string().min(2, "Supplier name is required"),
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    date: z.coerce.date(),
});

export type IAddStock = z.infer<typeof AddStockSchema>;
