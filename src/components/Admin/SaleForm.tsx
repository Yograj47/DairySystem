import { Controller, useFieldArray, useForm, useFormContext, FormProvider } from "react-hook-form";
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Delete } from "lucide-react";
import type { IProduct } from "../../pages/Admin/Products/ProductList";

interface IProductSchema {
    name: string;
    price: number;
    qty: number;
    unit: string;
}

interface ISaleForm {
    customerName: string;
    product: IProductSchema[];
}

// Common dairy units used in Nepal
const dairyUnits = ["kg", "ltr", "gm", "ml", "pcs"];

export default function SaleForm() {
    const methods = useForm<ISaleForm>({
        defaultValues: {
            customerName: "",
            product: [{ name: "", qty: 0, unit: "ltr", price: 0 }],
        }

    });

    const { handleSubmit, watch } = methods;

    const onSubmit = (data: ISaleForm) => {
        console.log("Submitted Data:", data);
    };

    console.log(watch());

    return (
        <div className="h-full w-full overflow-auto border-2 border-amber-300 p-4">
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex justify-center items-start flex-col gap-4"
                >
                    {/* Customer Name */}
                    <TextField
                        label="Customer Name"
                        size="medium"
                        {...methods.register("customerName")}
                    />

                    {/* Product List */}
                    <AddProduct />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "1.1rem", fontWeight: "semibold", mt: 2 }}
                    >
                        Proceed
                    </Button>
                </form>
            </FormProvider>
        </div >
    );
}

function AddProduct() {
    const { register, control } = useFormContext<ISaleForm>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "product",
    });

    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch("http://localhost:5000/products");
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchProduct();
    }, []);


    return (
        <div className="flex flex-col items-start gap-y-4 gap-x-2">
            <Typography variant="subtitle1" fontWeight="semibold" fontSize="1.4rem">
                Products
            </Typography>

            {fields.map((field, index) => (
                <div key={field.id} className="ml-2 px-2 border-l-2 border-gray-500 rounded-xs
                 grid grid-cols-12 gap-y-5 gap-x-3 items-center w-full">
                    {/* Product Select */}
                    <FormControl className="col-span-full md:col-span-5">
                        <InputLabel sx={{ top: -4 }}>Product</InputLabel>
                        <Controller
                            control={control}
                            name={`product.${index}.name` as const}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Product"
                                    size="small"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                >
                                    {products.map((p) => (
                                        <MenuItem key={p.name} value={p.name}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>

                    {/* Qty */}
                    <TextField
                        type="number"
                        label="Qty"
                        size="small"
                        className="md:col-span-2 col-span-3"
                        {...register(`product.${index}.qty` as const, { valueAsNumber: true })}
                    />

                    {/* Unit */}
                    <FormControl className="md:col-span-2 col-span-3">
                        <InputLabel>Unit</InputLabel>
                        <Select
                            label="Unit"
                            size="small"
                            {...register(`product.${index}.unit` as const)}
                            defaultValue={field.unit || ""}
                        >
                            {dairyUnits.map((unit) => (
                                <MenuItem key={unit} value={unit}>
                                    {unit}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Price */}
                    <TextField
                        type="number"
                        label="Price"
                        size="small"
                        className="md:col-span-2 col-span-3"
                        {...register(`product.${index}.price` as const, { valueAsNumber: true })}
                    />

                    {/* Delete Button */}
                    <button
                        className=" cursor-pointer hover:bg-red-200 rounded-full w-10 h-10 flex justify-center items-center"
                        onClick={() => remove(index)}
                    >
                        <Delete className="text-red-600" />
                    </button>
                </div>
            ))}

            {/* Add Product Button */}
            <Button
                variant="outlined"
                onClick={() => append({ name: "", qty: 0, unit: "ltr", price: 0 })}
            >
                Add Product
            </Button>
        </div>
    );
}
