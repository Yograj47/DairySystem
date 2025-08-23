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
    Divider,
    Card,
} from "@mui/material";
import { useForm, Controller, type Resolver } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "../../../components/context/DarkMode";

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
                                                        borderColor: isDark ? "#888" : "#666",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: isDark ? "#90caf9" : "#1976d2",
                                                    },
                                                },
                                                "& .MuiFormHelperText-root": {
                                                    color: isDark ? "#f87171" : "#d32f2f", // error text
                                                },
                                            }}
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
                                                label="Purchase Rate"
                                                type="number"
                                                placeholder="eg. 100"
                                                error={!!errors.purchaseRate}
                                                helperText={errors.purchaseRate?.message}
                                                fullWidth
                                                sx={{
                                                    "& .MuiInputBase-input": {
                                                        color: isDark ? "white" : "black",
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: isDark ? "white" : "gray",
                                                    },
                                                    "& .MuiOutlinedInput-root fieldset": {
                                                        borderColor: isDark ? "#555" : "#ccc",
                                                    },
                                                }}
                                            />
                                        )}
                                    />

                                    <Typography
                                        variant="body1"
                                        sx={{ color: isDark ? "white" : "black" }}
                                    >
                                        Per
                                    </Typography>

                                    <FormControl
                                        fullWidth
                                        error={!!errors.unit}
                                        sx={{
                                            "& .MuiInputLabel-root": {
                                                color: isDark ? "white" : "gray",
                                            },
                                            "& .MuiOutlinedInput-root .MuiSelect-select": {
                                                color: isDark ? "white" : "black",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: isDark ? "#555" : "#ccc",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: isDark ? "#fff" : "#ccc",
                                            },
                                        }}
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
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    color: isDark ? "white" : "black",
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: isDark ? "white" : "gray",
                                                },
                                                "& .MuiOutlinedInput-root fieldset": {
                                                    borderColor: isDark ? "#555" : "#ccc",
                                                },
                                            }}
                                        />
                                    )}
                                />

                                {/* Category */}
                                <FormControl
                                    fullWidth
                                    error={!!errors.category}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: isDark ? "white" : "gray",
                                        },
                                        "& .MuiOutlinedInput-root .MuiSelect-select": {
                                            color: isDark ? "white" : "black",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: isDark ? "#555" : "#ccc",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: isDark ? "#fff" : "#ccc",
                                        },
                                    }}
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
                                    sx={{
                                        backgroundColor: isDark ? "#2563eb" : undefined,
                                        "&:hover": {
                                            backgroundColor: isDark ? "#1d4ed8" : undefined,
                                        },
                                    }}
                                >
                                    {isSubmitting ? "Preparing..." : "Preview Invoice"}
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
                                        <Typography fontWeight="500">Name:</Typography>
                                        <Typography>{previewData.name}</Typography>
                                    </Box>

                                    <Box className="flex justify-between">
                                        <Typography fontWeight="500">Purchase Rate:</Typography>
                                        <Typography>
                                            {previewData.purchaseRate} / {previewData.unit}
                                        </Typography>
                                    </Box>

                                    <Box className="flex justify-between">
                                        <Typography fontWeight="500">Sale Rate:</Typography>
                                        <Typography>
                                            {previewData.saleRate} / {previewData.unit}
                                        </Typography>
                                    </Box>

                                    <Box className="flex justify-between">
                                        <Typography fontWeight="500">Category:</Typography>
                                        <Typography>{previewData.category}</Typography>
                                    </Box>
                                </Box>

                                <Box className="flex gap-3 mt-4 justify-end">
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={() => setPreviewData(null)}
                                    >
                                        Back to Edit
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
