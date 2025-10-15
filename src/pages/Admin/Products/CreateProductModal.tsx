import {
    Box,
    Card,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    CardContent,
    Divider,
} from "@mui/material";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect } from "react";
import { useDarkMode } from "../../../hook/DarkMode";
import { X } from "lucide-react";
import { darkTextFieldStyles } from "../../../utils/TextFieldStyle";
import { ProductSchema, type ProductData } from "../../../interface/Product";

function CreateProduct({
    open,
    onClose,
    productId,
}: {
    open: boolean;
    onClose: () => void;
    productId?: string;
}) {
    const { isDark } = useDarkMode();

    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductData>({
        resolver: zodResolver(ProductSchema) as Resolver<ProductData>,
        defaultValues: {
            name: "",
            costPrice: 0,
            basePrice: 0,
            unit: "",
            category: "",
        },
    });

    const watchedData = watch();

    useEffect(() => {
        if (productId) {
            axios
                .get(`http://localhost:5000/products/${productId}`)
                .then((res) => reset(res.data))
                .catch((err) => console.error("Failed to fetch product:", err));
        } else {
            reset({
                name: "",
                costPrice: 0,
                basePrice: 0,
                unit: "",
                category: "",
            });
        }
    }, [productId, reset]);

    const onSubmit = async (data: ProductData) => {
        try {
            const response = !productId
                ? await axios.post("http://localhost:5000/products", data)
                : await axios.patch(`http://localhost:5000/products/${productId}`, data);

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
            onClose();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            sx={{
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(4px)",
                },
            }}
        >
            {/* ============ Title ============ */}
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: isDark ? "#1e293b" : "#f9fafb",
                    color: isDark ? "white" : "black",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                }}
            >
                {productId ? "Edit Product" : "Create Product"}
                <IconButton onClick={onClose} color="inherit">
                    <X />
                </IconButton>
            </DialogTitle>

            {/* ============ Content ============ */}
            <DialogContent
                sx={{
                    bgcolor: isDark ? "#24303f" : "white",
                    color: isDark ? "white" : "black",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    height: "auto",
                    padding: 3,
                }}
            >
                {/* Left: Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                        padding: 2
                    }}
                >
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

                    <Controller
                        name="basePrice"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Base Price"
                                type="number"
                                placeholder="e.g. 150"
                                error={!!errors.basePrice}
                                helperText={errors.basePrice?.message}
                                fullWidth
                                sx={darkTextFieldStyles(isDark)}
                            />
                        )}
                    />

                    <FormControl fullWidth error={!!errors.unit} sx={darkTextFieldStyles(isDark)}>
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

                    <FormControl fullWidth error={!!errors.category} sx={darkTextFieldStyles(isDark)}>
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

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        sx={{
                            mt: 1,
                            py: 1.2,
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: "none",
                        }}
                    >
                        {productId ? "Save Changes" : "Create Product"}
                    </Button>
                </Box>

                {/* Right: Live Preview */}
                <Card
                    sx={{
                        flex: 1,
                        bgcolor: isDark ? "#1e293b" : "#f9fafb",
                        color: isDark ? "white" : "black",
                        borderRadius: 3,
                        p: 2,
                        boxShadow: isDark
                            ? "0 0 10px rgba(255,255,255,0.05)"
                            : "0 0 8px rgba(0,0,0,0.05)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                            Live Product Summary
                        </Typography>
                        <Divider sx={{ mb: 2, borderColor: isDark ? "#444" : "#ccc" }} />

                        <Typography><strong>Name:</strong> {watchedData.name || "—"}</Typography>
                        <Typography><strong>Category:</strong> {watchedData.category || "—"}</Typography>
                        <Typography><strong>Cost Price:</strong> Rs. {watchedData.costPrice || 0}</Typography>
                        <Typography><strong>Base Price:</strong> Rs. {watchedData.basePrice || 0}</Typography>
                        <Typography><strong>Unit:</strong> {watchedData.unit || "—"}</Typography>

                        <Divider sx={{ my: 2, borderColor: isDark ? "#444" : "#ccc" }} />

                        <Typography variant="body2" color="info">
                            {watchedData.basePrice && watchedData.costPrice
                                ? watchedData.basePrice > watchedData.costPrice
                                    ? `Profit Margin: ${(
                                        ((watchedData.basePrice - watchedData.costPrice) /
                                            watchedData.costPrice) *
                                        100
                                    ).toFixed(1)}%`
                                    : "⚠️ Selling below cost!"
                                : "Enter prices to see margin."}
                        </Typography>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default CreateProduct;
