import axios from "axios";
import { useEffect, useState } from "react";
import type { IProduct } from "../../utils/interface/Product";

export function useProduct() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:5000/products");
                setProducts(response.data);

            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false)
            }
        }
        fetchProduct();
    }, []);

    return { products, isLoading }
}
