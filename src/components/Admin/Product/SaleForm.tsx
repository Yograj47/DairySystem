import {
    Controller,
    useFieldArray,
    useForm,
    useFormContext,
    FormProvider,
    useWatch,
} from "react-hook-form";
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Select,
    IconButton,
} from "@mui/material";
import { Delete } from "lucide-react";
import { useProduct } from "../../hook/ProductList";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import type { IStock } from "../../../utils/interface/Stock";

interface IProductSchema {
    productId: string;
    name: string;
    rate: number;   // rate per 1 base unit (kg/ltr/piece/packet)
    price: number;  // computed price
    qty: number;    // entered in selected unit
    unit: string;   // 'kg'|'gm'|'ltr'|'ml'|'piece'|'packet'|'' ('' until product chosen)
}

interface ISaleForm {
    customerName: string;
    product: IProductSchema[];
}

export default function SaleForm() {
    const [stock, setStock] = useState<IStock[]>([]);
    const { products } = useProduct(); // used on submit to convert qty if you want

    const methods = useForm<ISaleForm>({
        defaultValues: {
            customerName: "",
            product: [
                { productId: "", name: "", qty: 0, unit: "", rate: 0, price: 0 },
            ],
        },
    });

    useEffect(() => {
        async function fetchStock() {
            const response = await axios.get(`http://localhost:5000/stock/`);
            setStock(response.data);
        }
        fetchStock();
    }, []);

    const { handleSubmit, reset } = methods;

    // Helper to convert to base quantity for stock updates (optional)
    const toBaseQty = (qty: number, unit: string, baseUnit: string) => {
        if (!qty || !baseUnit) return 0;
        if (baseUnit === "kg") return unit === "gm" ? qty / 1000 : qty;        // kg or gm
        if (baseUnit === "ltr") return unit === "ml" ? qty / 1000 : qty;       // ltr or ml
        // piece or packet
        return qty; // must match base exactly
    };

    const onSubmit = async (data: ISaleForm) => {
        await axios.post("http://localhost:5000/sales", data);

        // OPTIONAL: safer stock update using base units
        for (const item of data.product) {
            const p = products.find((pp: any) => pp.id === item.productId);
            const stockItem = stock.find((s) => s.productId === item.productId);
            if (!stockItem || !p) continue;

            const baseUnit = p.unit; // 'kg'|'ltr'|'piece'|'packet'
            const baseQty = toBaseQty(item.qty, item.unit, baseUnit);

            await axios.put(`http://localhost:5000/stock/${stockItem.id}`, {
                ...stockItem,
                remaining: (stockItem.remaining ?? 0) - baseQty,
                sold: (stockItem.sold ?? 0) + baseQty,
            });
        }

        reset();
    };

    return (
        <div className="h-full w-full overflow-auto bg-white shadow-xs shadow-blue-500 p-4">
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4"
                >
                    <TextField
                        label="Customer Name"
                        size="medium"
                        {...methods.register("customerName")}
                    />

                    <AddProduct />

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
        </div>
    );
}

/* ----------------- AddProduct & Row ----------------- */

function AddProduct() {
    const { control } = useFormContext<ISaleForm>();
    const { fields, append, remove } = useFieldArray({ control, name: "product" });

    return (
        <div className="flex flex-col items-start gap-4">
            <Typography variant="subtitle1" fontWeight="semibold" fontSize="1.4rem">
                Products
            </Typography>

            {fields.map((field, index) => (
                <LineItemRow key={field.id} index={index} onRemove={() => remove(index)} />
            ))}

            <Button
                type="button"
                variant="outlined"
                onClick={() =>
                    append({ productId: "", name: "", qty: 0, unit: "", rate: 0, price: 0 })
                }
            >
                Add Product
            </Button>
        </div>
    );
}

function LineItemRow({ index, onRemove }: { index: number; onRemove: () => void }) {
    const { control, setValue, register } = useFormContext<ISaleForm>();
    const { products } = useProduct();

    // Watch only this line’s fields
    const item = useWatch({ control, name: `product.${index}` });

    // Get selected product object
    const selectedProduct = useMemo(
        () => products.find((p: any) => p.id === item?.productId),
        [products, item?.productId]
    );

    // Allowed units derived from the product’s base unit
    const baseUnit: string | undefined = selectedProduct?.unit; // 'kg'|'ltr'|'piece'|'packet'
    const allowedUnits = useMemo(() => {
        if (!baseUnit) return [];
        if (baseUnit === "kg") return ["kg", "gm"];
        if (baseUnit === "ltr") return ["ltr", "ml"];
        if (baseUnit === "piece") return ["piece"];
        if (baseUnit === "packet") return ["packet"];
        return [];
    }, [baseUnit]);

    const computePrice = (rate: number, qty: number, unit: string, base: string | undefined) => {
        if (!rate || !qty || !unit || !base) return 0;
        // invalid unit → do not calculate
        if (!allowedUnits.includes(unit)) return 0;

        if (base === "kg") return unit === "gm" ? (rate * qty) / 1000 : rate * qty;
        if (base === "ltr") return unit === "ml" ? (rate * qty) / 1000 : rate * qty;
        // piece or packet
        return rate * qty; // exact units only
    };

    /* Sync on product change (name, rate, unit) */
    useEffect(() => {
        if (!selectedProduct) return;

        // name & rate from DB
        if (item?.name !== selectedProduct.name) {
            setValue(`product.${index}.name`, selectedProduct.name, { shouldDirty: false });
        }
        if (item?.rate !== selectedProduct.saleRate) {
            setValue(`product.${index}.rate`, selectedProduct.saleRate, { shouldDirty: false });
        }

        // If current unit is empty or invalid for this product, reset to base unit
        if (!item?.unit || !allowedUnits.includes(item.unit)) {
            setValue(`product.${index}.unit`, baseUnit!, { shouldDirty: false });
        }
    }, [selectedProduct, allowedUnits, baseUnit, index, item?.name, item?.rate, item?.unit, setValue]);

    /* Recompute price when qty/unit/rate changes */
    useEffect(() => {
        const price = computePrice(item?.rate, item?.qty, item?.unit, baseUnit);
        if (item?.price !== price) {
            setValue(`product.${index}.price`, Number(price.toFixed(2)), { shouldDirty: false });
        }
    }, [item?.rate, item?.qty, item?.unit, baseUnit, index, item?.price, setValue]);

    return (
        <div className="ml-2 px-2 border-l-2 border-gray-500 rounded grid grid-cols-12 gap-3 items-center w-full">
            {/* Product Select */}
            <FormControl className="col-span-full md:col-span-5">
                <InputLabel sx={{ top: -4 }}>Product</InputLabel>
                <Controller
                    control={control}
                    name={`product.${index}.productId`}
                    render={({ field }) => (
                        <Select {...field} size="small" value={field.value ?? ""} label="Product">
                            {products.map((p: any) => (
                                <MenuItem key={p.id} value={p.id}>
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
                inputProps={{ min: 0, step: "any" }}
                {...register(`product.${index}.qty`, { valueAsNumber: true })}
            />

            {/* Unit */}
            <FormControl className="md:col-span-2 col-span-3">
                <InputLabel>Unit</InputLabel>
                <Controller
                    control={control}
                    name={`product.${index}.unit`}
                    render={({ field }) => (
                        <Select {...field} label="Unit" size="small" value={field.value ?? ""}>
                            {/* Placeholder until a product is selected */}
                            {!selectedProduct && (
                                <MenuItem value="">
                                    <em>Select unit</em>
                                </MenuItem>
                            )}
                            {allowedUnits.map((u) => (
                                <MenuItem key={u} value={u}>
                                    {u}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </FormControl>

            {/* Price (auto) */}
            <TextField
                type="number"
                label="Price"
                size="small"
                className="md:col-span-2 col-span-3"
                {...register(`product.${index}.price`, { valueAsNumber: true })}
            />

            {/* Delete */}
            <IconButton color="error" onClick={onRemove}>
                <Delete />
            </IconButton>
        </div>
    );
}
