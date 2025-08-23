import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Divider,
    Paper,
    FormHelperText,
} from "@mui/material";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IProduct } from "../../../utils/interface/Product";
import type { IStock } from "../../../utils/interface/Stock";
import { useProduct } from "../../../components/hook/ProductFetch";
import { useStock } from "../../../components/hook/StockFetch";

// Validation Schema
const AddStockSchema = z.object({
    supplierName: z.string().min(2, "Supplier name is required"),
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    date: z.coerce.date(),
});

type IAddStock = z.infer<typeof AddStockSchema>;

export default function AddStock() {
    const {
        control,
        register,
        setValue,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IAddStock>({
        resolver: zodResolver(AddStockSchema) as Resolver<IAddStock>,
        defaultValues: {
            supplierName: "",
            productId: "",
            quantity: 0,
            price: 0,
            date: new Date(),
        },
    });

    const [unit, setUnit] = useState<string>();
    const [invoiceData, setInvoiceData] = useState<IAddStock | null>(null);
    const { data: products } = useProduct()
    const { data: stock } = useStock()

    const productData = products ? products : []
    const stockData = stock ? stock : []


    // Watch productId instead of productName
    const productId = watch("productId");

    // Update price & unit when product changes
    useEffect(() => {
        if (productId) {
            const selected = productData.find((p) => p.id === productId);
            if (selected) {
                setValue("price", selected.purchaseRate);
                setUnit(selected.unit);
            }
        } else {
            setValue("price", 0);
            setUnit(undefined);
        }
    }, [productId, productData, setValue]);

    // Submit handler
    const onSubmit = async (data: IAddStock) => {
        const stockItem = stockData.find(s => s.productId === productId);

        try {
            // 1. Save purchase record
            await axios.post("http://localhost:5000/purchases", data);

            // 2. Update stock for that product
            if (stockItem) {
                await axios.put(`http://localhost:5000/stock/${stockItem.id}`, {
                    ...stockItem,
                    total: stockItem.total + data.quantity,
                    remaining: stockItem.remaining + data.quantity - stockItem.sold
                });
            }

            // 3. Save data for invoice
            setInvoiceData(data);

            // 4. Reset form
            reset();
        } catch (err) {
            console.error("Error adding stock:", err);
        }
    };

    // Get selected product for invoice
    const selectedProduct = productData.find((p) => p.id === invoiceData?.productId);

    return (
        <div className="p-6 h-full w-full bg-gray-100 flex justify-start items-start flex-wrap md:justify-center gap-6">
            {/* AddStock Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full md:max-w-md bg-white p-6 rounded-lg shadow-md"
            >
                {/* Supplier Name */}
                <TextField
                    label="Supplier Name"
                    fullWidth
                    {...register("supplierName")}
                    error={!!errors.supplierName}
                    helperText={errors.supplierName?.message}
                />

                {/* Product */}
                <FormControl fullWidth error={!!errors.productId}>
                    <InputLabel id="product-label">Product</InputLabel>
                    <Controller
                        name="productId"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} labelId="product-label" label="Product">
                                {productData.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    <FormHelperText>{errors.productId?.message}</FormHelperText>
                </FormControl>

                {/* Quantity */}
                <TextField
                    type="number"
                    label="Quantity"
                    fullWidth
                    {...register("quantity")}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                />

                {/* Price */}
                <div className="flex w-full items-center gap-2 text-gray-500">
                    <TextField
                        type="number"
                        label="Price (Rs)"
                        fullWidth
                        {...register("price")}
                        disabled
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                    <Typography>per {unit ? unit : "unit"}</Typography>
                </div>

                {/* Date */}
                <TextField
                    type="date"
                    fullWidth
                    {...register("date")}
                    error={!!errors.date}
                    helperText={errors.date?.message?.toString()}
                />

                <Button variant="contained" type="submit" fullWidth>
                    Add Stock
                </Button>
            </form>

            {/* Invoice Section */}
            {invoiceData && selectedProduct && (
                <Paper elevation={3} className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
                    {/* Company Info */}
                    <div className="text-center mb-4">
                        <Typography variant="h5" className="font-bold text-gray-800">
                            Jack Dairy
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            Kathmandu, Nepal
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                            Invoice No: {Date.now()}
                        </Typography>
                    </div>
                    <Divider className="mb-4" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <Typography variant="h6" className="font-bold text-gray-800">
                            Purchase Invoice
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                            {new Date(invoiceData.date).toLocaleDateString()}
                        </Typography>
                    </div>
                    <Divider className="mb-4" />

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Supplier</span>
                            <span className="text-gray-800">{invoiceData.supplierName}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Product</span>
                            <span className="text-gray-800">
                                {selectedProduct.name} ({selectedProduct.category})
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Quantity</span>
                            <span className="text-gray-800">
                                {invoiceData.quantity} {unit}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Price</span>
                            <span className="text-gray-800">Rs {invoiceData.price}</span>
                        </div>
                    </div>

                    <Divider sx={{ margin: "1rem 0 .5rem" }} />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                        <Typography variant="subtitle1" fontWeight={"bold"} className="text-gray-800">
                            Total
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={"bold"} className="text-gray-900">
                            Rs {invoiceData.quantity * invoiceData.price}
                        </Typography>
                    </div>
                </Paper>
            )}
        </div>
    );
}
