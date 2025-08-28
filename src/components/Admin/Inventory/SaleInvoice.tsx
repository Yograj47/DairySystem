import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
} from "@mui/material";
import type { ISale } from "../../../utils/interface/Sale";

const COMPANY_INFO = {
    name: "Dairy Production",
    location: "Kathmandu, Nepal",
    email: "dairy123@gmail.com",
};

interface InvoiceProps {
    data: ISale;
    onBack: () => void; // Callback to go back to form
}

export function Invoice({ data, onBack }: InvoiceProps) {
    const subtotal = data.products.reduce((sum, p) => sum + p.total, 0);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                p: 4,
                bgcolor: "white",
                color: "black",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: 2,
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Company Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {COMPANY_INFO.name}
                    </Typography>
                    <Typography>{COMPANY_INFO.location}</Typography>
                    <Typography>{COMPANY_INFO.email}</Typography>
                </Box>
                <Box textAlign="right">
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Invoice
                    </Typography>
                    <Typography>
                        Date: {new Date(data.date).toLocaleDateString()}
                    </Typography>
                    <Typography>Invoice No: INV-{Date.now()}</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Customer Info */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Bill To:
                </Typography>
                <Typography>{data.customerName || "N/A"}</Typography>
            </Box>

            {/* Items Table */}
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="center">Unit</TableCell>
                            <TableCell align="right">Rate</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.products.map((p, i) => (
                            <TableRow key={i}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell align="center">{p.qty}</TableCell>
                                <TableCell align="center">{p.unit}</TableCell>
                                <TableCell align="right">{p.rate.toFixed(2)}</TableCell>
                                <TableCell align="right">{p.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Total Summary */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Box sx={{ width: "250px" }}>
                    <Divider sx={{ mb: 1 }} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                        }}
                    >
                        <span>Total</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                    </Box>
                </Box>
            </Box>

            {/* Back Button */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={onBack}>
                    Back to Edit
                </Button>
            </Box>
        </Box>
    );
}
