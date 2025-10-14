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
} from "@mui/material";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProduct } from "../../../hook/ProductFetch";
import { useStock } from "../../../hook/StockFetch";
import { useDarkMode } from "../../../hook/DarkMode";
import { darkTextFieldStyles } from "../../../utils/TextFieldStyle";
import { AddStockSchema, type IAddStock } from "../../../interface/Stock";


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

    // Update price + unit when product changes
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

    // Submit logic
    const onSubmit = async (data: IAddStock) => {
        const stockItem = stockData.find((s) => s.productId === productId);
        setInvoiceData(data);

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
        <Box className="p-6 h-full w-full flex justify-center items-start">
            {!invoiceData ? (
                // ============================
                // FORM
                // ============================
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
                        sx={darkTextFieldStyles(isDark)}
                    />

                    {/* Product */}
                    <FormControl
                        fullWidth
                        error={!!errors.productId}
                        sx={darkTextFieldStyles(isDark)}
                    >
                        <InputLabel id="product-label">Product</InputLabel>
                        <Controller
                            name="productId"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} labelId="product-label" label="Product">
                                    {productData.map((p) => (
                                        <MenuItem
                                            key={p.id}
                                            value={p.id}
                                            sx={darkTextFieldStyles(isDark)}
                                        >
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
                        sx={darkTextFieldStyles(isDark)}
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
                            sx={darkTextFieldStyles(isDark)}
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
                        sx={darkTextFieldStyles(isDark)}
                    />

                    {/* Submit */}
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{
                            backgroundColor: isDark ? "#2563eb" : undefined,
                            "&:hover": {
                                backgroundColor: isDark ? "#1d4ed8" : undefined,
                            },
                        }}
                    >
                        Preview
                    </Button>
                </form>
            ) : (
                // ============================
                // INVOICE PREVIEW
                // ============================
                <Card
                    sx={{
                        p: 4,
                        maxWidth: 600,
                        width: "100%",
                        backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                        color: isDark ? "white" : "black",
                        border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                        borderRadius: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    {/* Title */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 3,
                            borderBottom: `2px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                            pb: 1,
                            textAlign: "center",
                            letterSpacing: 1,
                        }}
                    >
                        📦 Stock Invoice Preview
                    </Typography>

                    {/* Supplier */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 3,
                            fontSize: "0.95rem",
                        }}
                    >
                        <Typography fontWeight={600}>Supplier:</Typography>
                        <Typography>{invoiceData.supplierName}</Typography>
                    </Box>

                    {/* Product Table */}
                    <Box
                        sx={{
                            overflowX: "auto",
                            borderRadius: 2,
                            border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "0.9rem",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: isDark ? "#334155" : "#f3f4f6",
                                        textAlign: "left",
                                    }}
                                >
                                    <th style={{ padding: "8px 12px" }}>Product</th>
                                    <th style={{ padding: "8px 12px" }}>Category</th>
                                    <th style={{ padding: "8px 12px" }}>Qty</th>
                                    <th style={{ padding: "8px 12px" }}>Unit</th>
                                    <th style={{ padding: "8px 12px" }}>
                                        Rate (Per {unit})
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    style={{
                                        borderBottom: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
                                    }}
                                >
                                    <td style={{ padding: "8px 12px" }}>
                                        {selectedProduct?.name}
                                    </td>
                                    <td style={{ padding: "8px 12px" }}>
                                        {selectedProduct?.category}
                                    </td>
                                    <td style={{ padding: "8px 12px" }}>
                                        {invoiceData.quantity}
                                    </td>
                                    <td style={{ padding: "8px 12px" }}>{unit}</td>
                                    <td style={{ padding: "8px 12px" }}>
                                        Rs {invoiceData.price}
                                    </td>
                                </tr>
                                <tr
                                    style={{
                                        fontWeight: "bold",
                                        backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                                    }}
                                >
                                    <td colSpan={4} style={{ padding: "8px 12px" }}>
                                        Total
                                    </td>
                                    <td colSpan={1} style={{ padding: "8px 12px" }}>
                                        Rs {invoiceData.quantity * invoiceData.price}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>

                    {/* Action Buttons */}
                    <Box className="flex gap-3 mt-6">
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                borderColor: isDark ? "#64748b" : "#ccc",
                                color: isDark ? "white" : "black",
                                "&:hover": {
                                    backgroundColor: isDark ? "#334155" : "#f3f4f6",
                                },
                            }}
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
                            sx={{
                                backgroundColor: isDark ? "#2563eb" : undefined,
                                "&:hover": {
                                    backgroundColor: isDark ? "#1d4ed8" : undefined,
                                },
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
