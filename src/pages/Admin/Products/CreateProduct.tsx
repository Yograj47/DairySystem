import {
    Box,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Typography,
} from "@mui/material";
import { useForm, Controller, type Resolver } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ProductSchema = z.object({
    name: z.string().min(3, { message: "Product name is required" }),
    purchaseRate: z.coerce.number().positive("Purchase rate must be > 0"),
    saleRate: z.coerce.number().positive("Sale rate must be > 0"),
    unit: z.string().min(1, "Unit is required"),
    category: z.string().min(1, "Category is required"),
});

type ProductData = z.infer<typeof ProductSchema>;

function CreateProduct() {
    const { id: productId } = useParams();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductData>({
        resolver: zodResolver(ProductSchema) as Resolver<ProductData>,
        defaultValues: {
            name: "",
            purchaseRate: 0,
            saleRate: 0,
            unit: "",
            category: "",
        },
    });

    useEffect(() => {
        if (productId) {
            axios
                .get(`http://localhost:5000/products/${productId}`)
                .then((res) => reset(res.data))
                .catch((err) => console.error("Failed to fetch product:", err));
        }
    }, [productId, reset]);

    const onSubmit = async (data: ProductData) => {
        try {
            const response = !productId
                ? await axios.post("http://localhost:5000/products", data)
                : await axios.patch(`http://localhost:5000/products/${productId}`, data);

            console.log("Response:", response.data);
            const { id } = response.data
            const stockData = {
                productId: id,
                total: 0,
                sold: 0,
                remaining: 0,
                status: "out of stock"
            }

            await axios.post("http://localhost:5000/stock", stockData)

            alert(productId ? "Edited Successfully" : "Added Successfully")
            if (!id) reset();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <Box className="h-full w-full flex justify-center items-start p-4">
            <Card className="w-full max-w-lg">
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", margin: ".5rem 0 1rem" }}
                    >
                        {!productId ? "Create Product" : "Edit Product"}
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        {/* Product Name */}
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Product Name"
                                    placeholder="Butter Milk"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    fullWidth
                                    InputLabelProps={{ shrink: !!field.value }}
                                />
                            )}
                        />

                        {/* Purchase Rate + Unit */}
                        <Box className="flex gap-4 items-center">
                            <Controller
                                name="purchaseRate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Purchase"
                                        type="number"
                                        placeholder="eg. 100"
                                        error={!!errors.purchaseRate}
                                        helperText={errors.purchaseRate?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Typography variant="body1">Per</Typography>

                            <FormControl fullWidth error={!!errors.unit}>
                                <InputLabel id="unit-label">Unit</InputLabel>
                                <Controller
                                    name="unit"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} labelId="unit-label" label="Unit">
                                            <MenuItem value="ltr">Litre</MenuItem>
                                            <MenuItem value="kg">Kg</MenuItem>
                                            <MenuItem value="piece">Piece</MenuItem>
                                            <MenuItem value="packet">Packet</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Box>

                        {/* Sale Rate */}
                        <Controller
                            name="saleRate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Sale Rate"
                                    type="number"
                                    placeholder="eg. 150"
                                    error={!!errors.saleRate}
                                    helperText={errors.saleRate?.message}
                                    fullWidth
                                />
                            )}
                        />

                        {/* Category */}
                        <FormControl fullWidth error={!!errors.category}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} labelId="category-label" label="Category">
                                        <MenuItem value="Milk">Milk</MenuItem>
                                        <MenuItem value="Cheese">Cheese</MenuItem>
                                        <MenuItem value="Yogurt">Yogurt</MenuItem>
                                        <MenuItem value="Butter">Butter</MenuItem>
                                        <MenuItem value="Bread">Bread</MenuItem>
                                        <MenuItem value="Cake">Cake</MenuItem>
                                        <MenuItem value="Ice Cream">Ice Cream</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Uploading..." : "Save Product"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CreateProduct;
