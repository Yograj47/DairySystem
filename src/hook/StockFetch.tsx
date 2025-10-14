import axios from "axios"
import type { IStock } from "../interface/Stock"
import { useQuery } from "@tanstack/react-query"

const fetchStock = async (): Promise<IStock[]> => {
    const { data } = await axios.get("http://localhost:5000/stock")
    return data
}

export function useStock() {
    return useQuery({
        queryKey: ["stock"],
        queryFn: fetchStock
    })
}