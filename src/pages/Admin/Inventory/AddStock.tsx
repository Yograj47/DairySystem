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
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import type { IProduct } from "../Products/ProductList";

interface IAddStock {
    supplierName: string;
    productName: string;
    quantity: number;
    price: number;
    date: Date;
}

export default function AddStock() {
    const { control, register, setValue, handleSubmit, reset } = useForm<IAddStock>({
        defaultValues: {
            supplierName: "",
            productName: "",
            quantity: 0,
            price: 0,
            date: new Date(),
        },
    });

    const [unit, setUnit] = useState<string>();
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

    const supplierName = useWatch({ control, name: "supplierName" });
    const productName = useWatch({ control, name: "productName" });
    const quantity = useWatch({ control, name: "quantity" }) || 0;
    const price = useWatch({ control, name: "price" }) || 0;
    const date = useWatch({ control, name: "date" });
    const totalPrice = quantity * price;

    useEffect(() => {
        if (productName) {
            const selected = products.find((p) => p.name === productName);
            if (selected) {
                setValue("price", selected.saleRate);
                setUnit(selected.unit);
            }
        } else {
            setValue("price", 0);
            setUnit(undefined);
        }
    }, [productName, products, setValue]);

    const onSubmit = (data: IAddStock) => {
        console.log("AddStock Data:", data);
        alert(`AddStockd ${data.quantity} of ${data.productName} at Rs ${data.price} each`);
        reset()
    };

    return (
        <div className="p-6 h-full w-full bg-gray-100 flex justify-start items-start flex-wrap md:justify-center gap-6">
            {/* AddStock Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full md:max-w-md bg-white p-6 rounded-lg shadow-md"
            >
                <TextField {...register("supplierName")} label="Supplier Name" fullWidth />

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

                <TextField type="number" label="Quantity" {...register("quantity")} fullWidth />

                <div className="flex w-full items-center gap-2 text-gray-500">
                    <TextField type="number" label="Price (Rs)" {...register("price")} disabled />
                    <Typography>per {unit ? unit : "unit"}</Typography>
                </div>

                <TextField
                    type="date"
                    {...register("date")}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />

                <Button variant="contained" type="submit" fullWidth>
                    AddStock
                </Button>
            </form>
            {/* Invoice Section */}
            <Paper elevation={3} className="p-6 w-full max-w-sm bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <Typography variant="h5" className="font-bold text-gray-800">
                        Invoice
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                        {date ? new Date(date).toLocaleDateString() : "____/____/____"}
                    </Typography>
                </div>
                <Divider className="mb-4" />

                {/* Details */}
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Supplier</span>
                        <span className="text-gray-800">{supplierName || "_____"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Product</span>
                        <span className="text-gray-800">{productName || "_____"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Quantity</span>
                        <span className="text-gray-800">
                            {quantity} {unit ? unit : ""}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Price</span>
                        <span className="text-gray-800">Rs {price}</span>
                    </div>
                </div>

                <Divider sx={{
                    margin: "1rem 0 .5rem"
                }} />

                {/* Total */}
                <div className="flex justify-between items-center">
                    <Typography variant="subtitle1" fontWeight={"bold"} className="text-gray-800">
                        Total
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={"bold"} className="text-gray-900">
                        Rs {totalPrice}
                    </Typography>
                </div>
            </Paper>

        </div>
    );
}
