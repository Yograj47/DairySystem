import { z } from "zod";

export const ProductSchema = z.object({
    productId: z.string(),
    name: z.string(),
    qty: z.number().int().nonnegative(),
    rate: z.number().nonnegative(),
    unit: z.string(),
    total: z.number().nonnegative(),
});

export const SaleSchema = z.object({
    customerName: z.string(),
    date: z.coerce.date(),
    products: z.array(ProductSchema).nonempty(),
});

export type IProductSchema = z.infer<typeof ProductSchema>;
export type ISale = z.infer<typeof SaleSchema>;
