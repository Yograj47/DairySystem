import z from "zod";

export const ProductSchema = z.object({
    name: z.string().min(3, { message: "Product name is required" }),
    costPrice: z.coerce.number().positive(" must be > 0"),
    basePrice: z.coerce.number().positive("Sale rate must be > 0"),
    unit: z.string().min(1, "Unit is required"),
    category: z.string().min(1, "Category is required"),
});

export type ProductData = z.infer<typeof ProductSchema>;


export interface IProduct {
    id: string;
    name: string;
    category: string;
    saleRate: number;
    purchaseRate: number;
    unit: string;
}