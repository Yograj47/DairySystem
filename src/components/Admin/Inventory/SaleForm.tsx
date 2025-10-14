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
import { useForm, Controller, type Resolver } from "react-hook-form";
import { type ISale, type IProductSchema, SaleSchema } from "../../../interface/Sale";
import { useProduct } from "../../../hook/ProductFetch";
import { useState } from "react";
import { useDarkMode } from "../../../hook/DarkMode";
import { Delete } from "lucide-react";
import { Invoice } from "./SaleInvoice";
import { darkTextFieldStyles } from "../../../utils/TextFieldStyle";
import { zodResolver } from "@hookform/resolvers/zod";



const tableCellStyles = (isDark: boolean) => ({
    color: isDark ? "white" : "black",
    borderColor: isDark ? "#374151" : "#e5e7eb",
});

export default function SaleForm() {
    const { data: products } = useProduct();
    const { isDark } = useDarkMode();

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ISale>({
        resolver: zodResolver(SaleSchema) as Resolver<ISale>,
        defaultValues: { customerName: "", date: new Date(), products: [] },
    });

    const productRows = watch("products");

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [qty, setQty] = useState<number>(1);

    // State for invoice page
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
        setInvoiceData(data); // Switch to invoice page
    };

    const subtotal = productRows.reduce((sum, p) => sum + p.total, 0);

    // Fake save function (replace with API call)
    const saveInvoice = async (data: ISale) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log("Invoice saved:", data);
                resolve();
            }, 1000);
        });
    };

    // 🔄 Show Invoice if invoiceData exists
    if (invoiceData) {
        return (
            <Invoice
                data={invoiceData}
                onBack={() => setInvoiceData(null)} // go back to edit
                onSave={saveInvoice} // save invoice
            />
        );
    }

    return (
        <Box className="p-2 h-full w-full flex justify-center items-start">
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
                            error={!!errors?.customerName}
                            helperText={errors?.customerName?.message}
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
                        error={!!errors?.products}
                        helperText={errors?.products?.message}
                        value={selectedProduct?.id || ""}
                        onChange={(e) => {
                            const p = products?.find((prod: any) => prod.id === e.target.value);
                            setSelectedProduct(p || null);
                        }}
                        className="lg:col-span-4"
                        sx={darkTextFieldStyles(isDark)}
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

                    <Button variant="contained" onClick={addProduct} size="medium" className="lg:col-span-1">
                        Add
                    </Button>
                </div>

                {/* Products Table */}
                <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: isDark ? "#1e293b" : "white" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: isDark ? "#334155" : "#f3f4f6" }}>
                                {["Product", "Qty", "Unit", "Rate", "Total", "Action"].map((head, i) => (
                                    <TableCell key={i} sx={tableCellStyles(isDark)}>
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
                                        <TableCell sx={tableCellStyles(isDark)}>{row.qty}</TableCell>
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
        </Box>
    );
}
