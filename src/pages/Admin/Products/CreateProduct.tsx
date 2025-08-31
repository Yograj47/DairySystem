import {
    Box,
    CardContent,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Card,
} from "@mui/material";
import { useForm, Controller, type Resolver } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "../../../components/hook/DarkMode";
import { Edit } from "lucide-react";
import { darkTextFieldStyles } from "../../../utils/TextFieldStyle";

const ProductSchema = z.object({
    name: z.string().min(3, { message: "Product name is required" }),
    costPrice: z.coerce.number().positive(" must be > 0"),
    saleRate: z.coerce.number().positive("Sale rate must be > 0"),
    unit: z.string().min(1, "Unit is required"),
    category: z.string().min(1, "Category is required"),
});

type ProductData = z.infer<typeof ProductSchema>;

function CreateProduct() {
    const { id: productId } = useParams();
    const { isDark } = useDarkMode();
    const [previewData, setPreviewData] = useState<ProductData | null>(null);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductData>({
        resolver: zodResolver(ProductSchema) as Resolver<ProductData>,
        defaultValues: {
            name: "",
            costPrice: 0,
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

    // Show invoice preview instead of saving immediately
    const onSubmit = (data: ProductData) => {
        setPreviewData(data);
    };

    // Confirm save
    const handleConfirm = async () => {
        if (!previewData) return;
        try {
            const response = !productId
                ? await axios.post("http://localhost:5000/products", previewData)
                : await axios.patch(
                    `http://localhost:5000/products/${productId}`,
                    previewData
                );

            console.log("Response:", response.data);

            if (!productId) {
                const { id } = response.data;
                await axios.post("http://localhost:5000/stock", {
                    productId: id,
                    total: 0,
                    sold: 0,
                    remaining: 0,
                    status: "out of stock",
                });
            }

            alert(productId ? "Edited Successfully" : "Added Successfully");
            reset();
            setPreviewData(null);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <Box
            className={`h-full w-full flex justify-center items-start p-4 bg-transparent text-black"
                }`}
        >
            <div
                className={`w-full max-w-lg shadow-md ${isDark ? "bg-[#24303f] text-white" : "bg-white text-black"
                    }`}
            >
                <CardContent>
                    {!previewData ? (
                        <>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: "bold", margin: ".5rem 0 1rem" }}
                            >
                                {!productId ? "Create Product" : "Edit Product"}
                            </Typography>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col gap-4"
                            >
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
                                            sx={darkTextFieldStyles(isDark)}
                                        />
                                    )}
                                />

                                {/* Cost Price (Purchase Rate) */}
                                <Controller
                                    name="costPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Cost Price"
                                            type="number"
                                            placeholder="e.g. 100"
                                            error={!!errors.costPrice}
                                            helperText={errors.costPrice?.message}
                                            fullWidth
                                            sx={darkTextFieldStyles(isDark)}
                                        />
                                    )}
                                />

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
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    color: isDark ? "white" : "black",
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: isDark ? "white" : "gray",
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: isDark ? "#555" : "#ccc",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: isDark ? "white" : "#666",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: isDark ? "white" : "#1976d2",
                                                    },
                                                },
                                                "&:hover .MuiInputBase-input": {
                                                    color: isDark ? "white" : "black",
                                                },
                                            }}
                                        />
                                    )}
                                />

                                {/* Unit */}
                                <FormControl
                                    fullWidth
                                    error={!!errors.unit}
                                    sx={darkTextFieldStyles(isDark)}
                                >
                                    <InputLabel id="unit-label">Unit</InputLabel>
                                    <Controller
                                        name="unit"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Unit" labelId="unit-label">
                                                <MenuItem value="ltr">Litre</MenuItem>
                                                <MenuItem value="kg">Kg</MenuItem>
                                                <MenuItem value="piece">Piece</MenuItem>
                                                <MenuItem value="packet">Packet</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>

                                {/* Category */}
                                <FormControl
                                    fullWidth
                                    error={!!errors.category}
                                    sx={darkTextFieldStyles(isDark)}
                                >
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Category" labelId="category-label">
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
                                    {isSubmitting ? "Preparing..." : "Preview"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Invoice Preview */}
                            <Card
                                sx={{
                                    p: 3,
                                    backgroundColor: isDark ? "#1e293b" : "#f9fafb",
                                    color: isDark ? "white" : "black",
                                    border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
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
                                    Product Detail Preview
                                </Typography>

                                <Box className="space-y-2 text-sm">
                                    <Box className="flex justify-between">
                                        <Typography fontWeight="600">Name:</Typography>
                                        <Typography>{previewData.name}</Typography>
                                    </Box>

                                    <Box className="flex justify-between">
                                        <Typography fontWeight="600">Cost Price:</Typography>
                                        <Typography>
                                            {previewData.costPrice} / {previewData.unit}
                                        </Typography>
                                    </Box>

                                    <Box className="flex justify-between">
                                        <Typography fontWeight="600">Sale Rate:</Typography>
                                        <Typography>
                                            {previewData.saleRate} / {previewData.unit}
                                        </Typography>
                                    </Box>

                                    <Box className="flex justify-between">
                                        <Typography fontWeight="600">Category:</Typography>
                                        <Typography>{previewData.category}</Typography>
                                    </Box>
                                </Box>

                                <Box className="flex gap-3 mt-4 justify-end">
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={() => setPreviewData(null)}
                                    >
                                        <Edit className="mr-2" />  Back to Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleConfirm}
                                    >
                                        {productId ? "Confirm Update" : "Confirm Create"}
                                    </Button>
                                </Box>
                            </Card>
                        </>
                    )}
                </CardContent>
            </div>
        </Box>
    );
}

export default CreateProduct;
