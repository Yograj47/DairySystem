export interface IProductSchema {
    productId: string;
    name: string;
    rate: number;
    total: number;
    qty: number;
}

export interface ISale {
    customerName: string;
    date: Date;
    products: IProductSchema[];
}