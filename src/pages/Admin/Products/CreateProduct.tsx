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
import { useForm, Controller } from "react-hook-form";

interface ProductData {
    name: string;
    purchaseRate: number;
    saleRate: number;
    unit: string;
    category: string;
}

function CreateProduct() {
    const { register, handleSubmit, control, reset } = useForm<ProductData>({
        defaultValues: {
            name: "",
            purchaseRate: 0,
            saleRate: 0,
            unit: "",
            category: "",
        },
    });


    const onSubmit = (data: ProductData) => {
        console.log("Product Created:", data);
        window.alert(`Product Created: ${data.name}`);
        reset();
    };

    return (
        <Box className="h-full w-full flex justify-center items-start p-4">
            <Card className="w-full max-w-lg shadow-md rounded-xl">
                <CardContent>
                    <Typography variant="h5" className="font-semibold">
                        Create Product
                    </Typography>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 mt-4"
                    >
                        {/* Product Name */}
                        <TextField
                            {...register("name", { required: "Product name is required" })}
                            label="Name"
                            placeholder="Butter Milk"
                            fullWidth
                        />

                        {/* Purchase Rate + Unit */}
                        <Box className="flex gap-4 justify-center items-center">
                            <TextField
                                {...register("purchaseRate", { valueAsNumber: true })}
                                label="Purchase Rate"
                                type="number"
                                placeholder="eg. 100"
                                fullWidth
                            />

                            <Typography variant="body1">Per</Typography>

                            <FormControl fullWidth>
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

                        <TextField
                            {...register("saleRate", { valueAsNumber: true })}
                            label="Sale Rate"
                            type="number"
                            fullWidth
                        />

                        {/* Category */}
                        <FormControl fullWidth>
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
                        <Button type="submit" variant="contained" color="primary">
                            Save Product
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CreateProduct;
