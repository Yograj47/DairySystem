"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import type { ISale } from "../../../utils/interface/Sale";
import { Button } from "@mui/material";

const COMPANY_INFO = {
    name: "Dairy Production",
    location: "Kathmandu, Nepal",
    email: "dairy123@gmail.com",
};

interface InvoiceProps {
    data: ISale;
    onBack: () => void;
    onSave: (data: ISale) => Promise<void>;
}

export function Invoice({ data, onBack, onSave }: InvoiceProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    const subtotal = data.products.reduce((sum, p) => sum + p.total, 0);
    const tax = subtotal * 0.0;
    const grandTotal = subtotal + tax;

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Invoice-${Date.now()}`,
    });

    const handleCheckout = async () => {
        try {
            setLoading(true);
            await onSave(data);
            setIsSaved(true);
            setTimeout(() => handlePrint?.(), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[90vh] w-full flex flex-col justify-center items-center">
            {/* Invoice Box */}
            <div
                ref={contentRef}
                className="max-w-3xl w-full mx-auto bg-white text-black p-10 shadow-lg border border-gray-400 
                print:shadow-none print:border-0 font-serif"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold uppercase tracking-wide">{COMPANY_INFO.name}</h1>
                        <p className="text-sm">{COMPANY_INFO.location}</p>
                        <p className="text-sm">{COMPANY_INFO.email}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold uppercase">Invoice</h2>
                        <p className="text-sm">Date: {new Date(data.date).toLocaleDateString()}</p>
                        <p className="text-sm font-semibold">Invoice No: INV-{Date.now()}</p>
                    </div>
                </div>

                <hr className="my-6 border-gray-500" />

                {/* Customer Info */}
                <div className="mb-6">
                    <h3 className="font-semibold">Bill To:</h3>
                    <p className="ml-2 font-medium">{data.customerName || "N/A"}</p>
                </div>

                {/* Items Table */}
                <table className="w-full border border-black text-sm">
                    <thead className="bg-gray-100 print:bg-white">
                        <tr className="uppercase">
                            <th className="border border-black px-3 py-2 text-left">SN</th>
                            <th className="border border-black px-3 py-2 text-left">Product</th>
                            <th className="border border-black px-3 py-2 text-center">Qty</th>
                            <th className="border border-black px-3 py-2 text-center">Unit</th>
                            <th className="border border-black px-3 py-2 text-right">Rate</th>
                            <th className="border border-black px-3 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map((p, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50 print:even:bg-white">
                                <td className="border border-black px-3 py-2 text-center">{i + 1}</td>
                                <td className="border border-black px-3 py-2">{p.name}</td>
                                <td className="border border-black px-3 py-2 text-center">{p.qty}</td>
                                <td className="border border-black px-3 py-2 text-center">{p.unit}</td>
                                <td className="border border-black px-3 py-2 text-right">{p.rate.toFixed(2)}</td>
                                <td className="border border-black px-3 py-2 text-right">{p.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mt-8">
                    <div className="w-72 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax:</span>
                            <span className="font-medium">Rs. {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-dashed border-black pt-2 text-lg">
                            <span>Grand Total:</span>
                            <span>Rs. {grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-xs text-gray-700">
                    <p>Thank you for your business!</p>
                    <p>Payment due within 7 days.</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 print:hidden">
                {!isSaved ? (
                    <>
                        <Button
                            variant="outlined"
                            onClick={onBack}
                        >
                            Back to Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Checkout"}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => handlePrint?.()}
                    >
                        Print Invoice
                    </Button>
                )}
            </div>
        </div>
    );
}
