import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ISale } from '../interface/Sale';

const fetchProduct = async (): Promise<ISale[]> => {
    const { data } = await axios.get("http://localhost:5000/sales");
    return data;
};

export function useSales() {
    return useQuery({
        queryKey: ["sales"],
        queryFn: fetchProduct
    });
}
