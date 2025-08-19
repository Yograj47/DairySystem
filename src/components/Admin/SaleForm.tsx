import { Controller, useForm } from "react-hook-form";
import {
    TextField,
    Button,
    MenuItem,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    RadioGroup,
    Radio,
    Paper,
    Divider
} from "@mui/material";
import { useEffect, useState } from "react";
import type { IProduct } from "../../pages/Admin/Products/ProductList";

interface ISaleForm {
    customerName: string;
    productName: string;
    mode: "quantity" | "amount";
    quantity: number;
    amountGiven: number;
}

export default function SaleForm() {
    const { register, handleSubmit, reset, control, watch } = useForm<ISaleForm>({
        defaultValues: { mode: "quantity" }
    });

    const mode = watch("mode");
    const [submittedData, setSubmittedData] = useState<ISaleForm | null>(null);

    const onSubmit = (data: ISaleForm) => {
        console.log("Submitted Data:", data);
        setSubmittedData(data);
        reset({ mode: "quantity" });
    };

    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch("/Data/Products.json");
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchProduct();
    }, []);

    return (
        <div className="flex flex-col md:flex-row bg-white p-4 gap-6">
            {/* Sale Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full md:w-3/5 flex flex-col gap-4 p-4 md:p-6 bg-gray-50 rounded-lg shadow"
            >
                <Typography variant="h6" fontWeight="bold">New Sale</Typography>

                {/* Customer Name */}
                <TextField
                    label="Customer Name"
                    fullWidth
                    {...register("customerName", { required: "Customer Name is required" })}
                />

                {/* Product Select */}
                <FormControl fullWidth>
                    <InputLabel id="product-label">Product</InputLabel>
                    <Controller
                        name="productName"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} labelId="product-label" label="Product">
                                {products.map((p) => (
                                    <MenuItem key={p.name} value={p.name}>
                                        {p.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>

                {/* Mode Select */}
                <FormControl>
                    <Typography variant="subtitle1" gutterBottom>
                        Sale Mode
                    </Typography>
                    <Controller
                        name="mode"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup row {...field}>
                                <FormControlLabel
                                    value="quantity"
                                    control={<Radio />}
                                    label="By Quantity"
                                />
                                <FormControlLabel
                                    value="amount"
                                    control={<Radio />}
                                    label="By Amount"
                                />
                            </RadioGroup>
                        )}
                    />
                </FormControl>

                {/* Conditional Fields */}
                {mode === "quantity" && (
                    <TextField
                        type="number"
                        label="Quantity"
                        fullWidth
                        {...register("quantity", { valueAsNumber: true })}
                    />
                )}

                {mode === "amount" && (
                    <TextField
                        type="number"
                        label="Amount Given"
                        fullWidth
                        {...register("amountGiven", { valueAsNumber: true })}
                    />
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ py: 1.5, fontWeight: "bold" }}
                >
                    Proceed
                </Button>
            </form>

            {/* Invoice Section */}
            <Paper
                elevation={3}
                className="w-full md:w-2/5 p-4 md:p-6 bg-white rounded-lg shadow flex-shrink-0"
            >
                <div className="flex items-center justify-between mb-2">
                    <Typography variant="h5" fontWeight="bold">
                        Invoice
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {new Date().toLocaleDateString()}
                    </Typography>
                </div>
                <Divider className="mb-4" />

                {submittedData ? (
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="font-semibold">Customer:</span>{" "}
                            {submittedData.customerName}
                        </p>
                        <p>
                            <span className="font-semibold">Product:</span>{" "}
                            {submittedData.productName}
                        </p>
                        <p>
                            <span className="font-semibold">Mode:</span>{" "}
                            {submittedData.mode === "quantity" ? "By Quantity" : "By Amount"}
                        </p>
                        {submittedData.mode === "quantity" && (
                            <p>
                                <span className="font-semibold">Quantity:</span>{" "}
                                {submittedData.quantity}
                            </p>
                        )}
                        {submittedData.mode === "amount" && (
                            <p>
                                <span className="font-semibold">Amount Given:</span>{" "}
                                Rs {submittedData.amountGiven}
                            </p>
                        )}
                    </div>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No sale submitted yet.
                    </Typography>
                )}
            </Paper>
        </div>
    );
}
