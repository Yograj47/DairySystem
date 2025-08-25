import {
    Box,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Card,
    FormHelperText,
    Divider,
} from "@mui/material";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProduct } from "../../../components/hook/ProductFetch";
import { useStock } from "../../../components/hook/StockFetch";
import { useDarkMode } from "../../../components/context/DarkMode";

const AddStockSchema = z.object({
    supplierName: z.string().min(2, "Supplier name is required"),
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    date: z.coerce.date(),
});

type IAddStock = z.infer<typeof AddStockSchema>;

export default function AddStock() {
    const { isDark } = useDarkMode();
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

    const { data: products } = useProduct();
    const { data: stock } = useStock();

    const productData = products ?? [];
    const stockData = stock ?? [];
    const productId = watch("productId");

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

    const onSubmit = async (data: IAddStock) => {
        const stockItem = stockData.find((s) => s.productId === productId);
        setInvoiceData(data); // show preview immediately

        try {
            await axios.post("http://localhost:5000/purchases", data);

            if (stockItem) {
                await axios.put(`http://localhost:5000/stock/${stockItem.id}`, {
                    ...stockItem,
                    total: stockItem.total + data.quantity,
                    remaining: stockItem.remaining + data.quantity - stockItem.sold,
                });
            }
        } catch (err) {
            console.error("Error adding stock:", err);
        }
    };

    const selectedProduct = productData.find(
        (p) => p.id === invoiceData?.productId
    );

    return (
        <Box className={`p-6 h-full w-full flex justify-center items-start`}>
            {!invoiceData ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={`flex flex-col gap-4 w-full max-w-md p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
                        }`}
                >
                    {/* Supplier */}
                    <TextField
                        label="Supplier Name"
                        fullWidth
                        {...register("supplierName")}
                        error={!!errors.supplierName}
                        helperText={errors.supplierName?.message}
                        sx={{
                            "& .MuiInputBase-input": { color: isDark ? "white" : "black" },
                            "& .MuiInputLabel-root": { color: isDark ? "white" : "gray" },
                            "& .MuiOutlinedInput-root fieldset": {
                                borderColor: isDark ? "#555" : "#ccc",
                            },
                        }}
                    />

                    {/* Product */}
                    <FormControl
                        fullWidth
                        error={!!errors.productId}
                        sx={{
                            "& .MuiInputLabel-root": { color: isDark ? "white" : "gray" },
                            "& .MuiOutlinedInput-root .MuiSelect-select": {
                                color: isDark ? "white" : "black",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: isDark ? "#555" : "#ccc",
                            },
                            "& .MuiSvgIcon-root": { color: isDark ? "#fff" : "#ccc" },
                        }}
                    >
                        <InputLabel id="product-label">Product</InputLabel>
                        <Controller
                            name="productId"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Product" labelId="product-label">
                                    {productData.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <FormHelperText>
                            {errors.productId?.message}
                        </FormHelperText>
                    </FormControl>

                    {/* Quantity */}
                    <TextField
                        type="number"
                        label="Quantity"
                        fullWidth
                        {...register("quantity")}
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                        sx={{
                            "& .MuiInputBase-input": { color: isDark ? "white" : "black" },
                            "& .MuiInputLabel-root": { color: isDark ? "white" : "gray" },
                            "& .MuiOutlinedInput-root fieldset": {
                                borderColor: isDark ? "#555" : "#ccc",
                            },
                        }}
                    />

                    {/* Price */}
                    <Box className="flex gap-2 items-center">
                        <TextField
                            type="number"
                            label="Price (Rs)"
                            fullWidth
                            {...register("price")}
                            disabled
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            sx={{
                                "& .MuiInputBase-input.Mui-disabled": { color: isDark ? "white" : "black" },
                                "& .MuiInputLabel-root.Mui-disabled": { color: isDark ? "white" : "gray" },
                                "& .MuiOutlinedInput-root fieldset": {
                                    borderColor: isDark ? "#555" : "#ccc",
                                },
                            }}
                        />
                        <Typography sx={{ color: isDark ? "white" : "black" }}>
                            per {unit || "unit"}
                        </Typography>
                    </Box>

                    {/* Date */}
                    <TextField
                        type="date"
                        fullWidth
                        {...register("date")}
                        error={!!errors.date}
                        helperText={errors.date?.message?.toString()}
                        sx={{
                            "& .MuiInputBase-input": { color: isDark ? "white" : "black" },
                            "& .MuiInputLabel-root": { color: isDark ? "white" : "gray" },
                            "& .MuiOutlinedInput-root fieldset": {
                                borderColor: isDark ? "#555" : "#ccc",
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{
                            backgroundColor: isDark ? "#2563eb" : undefined,
                            "&:hover": { backgroundColor: isDark ? "#1d4ed8" : undefined },
                        }}
                    >
                        Preview Invoice
                    </Button>
                </form>
            ) : (
                <Card
                    sx={{
                        p: 4,
                        maxWidth: 500,
                        width: "100%",
                        backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                        color: isDark ? "white" : "black",
                        border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                        borderRadius: 2,
                        boxShadow: "sm",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            borderBottom: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                            pb: 1,
                        }}
                    >
                        Invoice Preview
                    </Typography>

                    <Box className="space-y-2 text-sm">
                        <Box className="flex justify-between">
                            <Typography fontWeight={500}>Supplier:</Typography>
                            <Typography>{invoiceData.supplierName}</Typography>
                        </Box>
                        <Box className="flex justify-between">
                            <Typography fontWeight={500}>Product:</Typography>
                            <Typography>
                                {selectedProduct?.name} ({selectedProduct?.category})
                            </Typography>
                        </Box>
                        <Box className="flex justify-between">
                            <Typography fontWeight={500}>Quantity:</Typography>
                            <Typography>
                                {invoiceData.quantity} {unit}
                            </Typography>
                        </Box>
                        <Box className="flex justify-between">
                            <Typography fontWeight={500}>Price:</Typography>
                            <Typography>Rs {invoiceData.price}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box className="flex justify-between font-bold">
                            <Typography>Total:</Typography>
                            <Typography>Rs {invoiceData.quantity * invoiceData.price}</Typography>
                        </Box>
                    </Box>

                    <Box className="flex gap-3 mt-4">
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setInvoiceData(null)}
                        >
                            Back to Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                alert("Proceeding with this invoice!");
                                reset();
                                setInvoiceData(null);
                            }}
                        >
                            Proceed
                        </Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
}
