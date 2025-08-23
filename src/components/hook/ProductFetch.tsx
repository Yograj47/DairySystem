import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { IProduct } from '../../utils/interface/Product';

const fetchProduct = async (): Promise<IProduct[]> => {
    const { data } = await axios.get("http://localhost:5000/products");
    return data;
};

export function useProduct() {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProduct
    });
}
