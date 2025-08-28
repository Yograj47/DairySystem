import {
    Box,
    TextField,
    MenuItem,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import type { ISale, IProductSchema } from "../../../utils/interface/Sale";
import { useProduct } from "../../hook/ProductFetch";
import { useState } from "react";
import { useDarkMode } from "../../hook/DarkMode";
import { Delete } from "lucide-react";
import { Invoice } from "./SaleInvoice";

const darkTextFieldStyles = (isDark: boolean) => ({
    "& .MuiInputBase-input": { color: isDark ? "white" : "black" },
    "& .MuiInputLabel-root": { color: isDark ? "rgba(255,255,255,0.8)" : "gray" },
    "& .MuiInputLabel-root.Mui-disabled": { color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" },
    "& .MuiSvgIcon-root": { color: isDark ? "white" : "black" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: isDark ? "#555" : "#ccc" },
        "&:hover fieldset": { borderColor: isDark ? "white" : "#666" },
        "&.Mui-focused fieldset": { borderColor: isDark ? "white" : "#1976d2" },
    },
    "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" },
    "& .MuiOutlinedInput-root.Mui-disabled fieldset": { borderColor: isDark ? "#444" : "#ddd" },
});

const tableCellStyles = (isDark: boolean) => ({
    color: isDark ? "white" : "black",
    borderColor: isDark ? "#374151" : "#e5e7eb",
});

export default function SaleForm() {
    const { data: products } = useProduct();
    const { isDark } = useDarkMode();

    const methods = useForm<ISale>({
        defaultValues: { customerName: "", date: new Date(), products: [] },
    });

    const { control, handleSubmit, reset, setValue, watch } = methods;
    const productRows = watch("products");

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [qty, setQty] = useState<number>(1);

    // State for submitted invoice data
    const [invoiceData, setInvoiceData] = useState<ISale | null>(null);

    const addProduct = () => {
        if (!selectedProduct || qty <= 0) return;

        const newProduct: IProductSchema = {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            qty,
            rate: selectedProduct.saleRate,
            unit: selectedProduct.unit,
            total: qty * selectedProduct.saleRate,
        };

        setValue("products", [...productRows, newProduct]);
        setSelectedProduct(null);
        setQty(1);
    };

    const removeProduct = (index: number) => {
        const newRows = [...productRows];
        newRows.splice(index, 1);
        setValue("products", newRows);
    };

    const onSubmit = (data: ISale) => {
        console.log("Final Sale Data:", data);
        setInvoiceData(data); // Set submitted data for invoice
        setSelectedProduct(null);
        setQty(1);
    };

    const subtotal = productRows.reduce((sum, p) => sum + p.total, 0);

    // Conditionally render Invoice or Sale Form
    if (invoiceData) {
        return <Invoice data={invoiceData} />;
    }

    return (
        <Box className="p-2 h-full w-full flex justify-center items-start">
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={`flex flex-col gap-4 w-full h-full p-6 rounded-lg shadow-md transition-colors ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
                        }`}
                >
                    {/* Header */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                            pb: 1,
                            mb: 2,
                            color: isDark ? "white" : "black",
                        }}
                    >
                        🧾 Sale Form
                    </Typography>

                    {/* Customer Name */}
                    <Controller
                        control={control}
                        name="customerName"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Customer Name"
                                fullWidth
                                variant="outlined"
                                sx={darkTextFieldStyles(isDark)}
                            />
                        )}
                    />

                    {/* Product Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2">
                        <TextField
                            size="small"
                            select
                            label="Product"
                            value={selectedProduct?.id || ""}
                            onChange={(e) => {
                                const p = products?.find((prod: any) => prod.id === e.target.value);
                                setSelectedProduct(p || null);
                            }}
                            className="lg:col-span-4"
                            sx={darkTextFieldStyles(isDark)}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: isDark ? "#1e293b" : "white",
                                            color: isDark ? "white" : "black",
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">Select Product</MenuItem>
                            {products?.map((p: any) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Qty"
                            type="number"
                            size="small"
                            value={qty}
                            className="lg:col-span-2"
                            onChange={(e) => setQty(Number(e.target.value))}
                            sx={darkTextFieldStyles(isDark)}
                        />

                        <TextField
                            label="Rate"
                            className="lg:col-span-1"
                            size="small"
                            value={selectedProduct?.saleRate || ""}
                            disabled
                            sx={darkTextFieldStyles(isDark)}
                        />

                        <TextField
                            label="Unit"
                            className="lg:col-span-2"
                            size="small"
                            value={selectedProduct?.unit || ""}
                            disabled
                            sx={darkTextFieldStyles(isDark)}
                        />

                        <TextField
                            label="Total"
                            className="lg:col-span-2"
                            size="small"
                            value={selectedProduct ? (qty * selectedProduct.saleRate).toFixed(2) : ""}
                            disabled
                            sx={darkTextFieldStyles(isDark)}
                        />

                        <Button
                            variant="contained"
                            onClick={addProduct}
                            size="medium"
                            className="lg:col-span-1"
                        >
                            Add
                        </Button>
                    </div>

                    {/* Products Table */}
                    <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: isDark ? "#1e293b" : "white" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: isDark ? "#334155" : "#f3f4f6" }}>
                                    {["Product", "Qty", "Unit", "Rate", "Total", "Action"].map((head, i) => (
                                        <TableCell
                                            key={i}
                                            align={head === "Qty" || head === "Action" ? "center" : "left"}
                                            sx={tableCellStyles(isDark)}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productRows.length > 0 ? (
                                    productRows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={tableCellStyles(isDark)}>{row.name}</TableCell>
                                            <TableCell align="center" sx={tableCellStyles(isDark)}>{row.qty}</TableCell>
                                            <TableCell sx={tableCellStyles(isDark)}>{row.unit}</TableCell>
                                            <TableCell sx={tableCellStyles(isDark)}>{row.rate}</TableCell>
                                            <TableCell sx={tableCellStyles(isDark)}>{row.total.toFixed(2)}</TableCell>
                                            <TableCell align="center" sx={tableCellStyles(isDark)}>
                                                <IconButton color="error" onClick={() => removeProduct(index)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={tableCellStyles(isDark)}>
                                            No products added yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Subtotal */}
                    <Typography variant="h6" align="right" sx={{ mt: 2, color: isDark ? "white" : "black" }}>
                        Subtotal: Rs. {subtotal.toFixed(2)}
                    </Typography>

                    {/* Actions */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                reset();
                                setSelectedProduct(null);
                                setQty(1);
                            }}
                        >
                            Reset
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Proceed to Invoice
                        </Button>
                    </Box>
                </form>
            </FormProvider>
        </Box>
    );
}
