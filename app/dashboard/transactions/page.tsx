"use client";
import React, { useEffect, useState } from "react";
import { Eye, Copy, Trash2, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getTransactions } from "@/lib/utils";
import { formatDate } from "../payment_method/page";
import Link from "next/link";

// Transaction type
type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

type Transaction = {
  id: string;
  user: string;
  wallet: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "INTERNAL_TRANSFER";
  amount: number;
  toAddress: string;
  fromAddress: string;
  txHash?: string;
  status: TransactionStatus;
  createdAt: string;
};

// Dummy data (replace with API fetch)
const initialTransactions: Transaction[] = [
  {
    id: "1",
    user: "John Doe",
    wallet: "BTC Wallet",
    type: "DEPOSIT",
    amount: 0.05,
    toAddress: "1A2b3C4D5E...",
    fromAddress: "XyZ987654...",
    txHash: "0x123abc456def",
    status: "COMPLETED",
    createdAt: "2025-09-20",
  },
  {
    id: "2",
    user: "Jane Smith",
    wallet: "USDT Wallet",
    type: "WITHDRAWAL",
    amount: 250,
    toAddress: "TetherAddr123...",
    fromAddress: "Wallet987...",
    txHash: "0x789ghi012jkl",
    status: "FAILED",
    createdAt: "2025-09-22",
  },
  {
    id: "3",
    user: "Mike Johnson",
    wallet: "ETH Wallet",
    type: "DEPOSIT",
    amount: 1.2,
    toAddress: "0x1234abcd...",
    fromAddress: "0xabcd5678...",
    txHash: undefined,
    status: "PENDING",
    createdAt: "2025-09-25",
  },
];

const ITEMS_PER_PAGE = 5;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getTransactions();
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        setLoading(false);
        const res = await getTransactions();
        setTransactions(res?.transactions);
        console.log(res?.transactions);
      }
    })();
  }, []);

  const filtered = transactions.filter(
    (tx) =>
      tx?.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      tx?.wallet?.currency.toLowerCase().includes(search.toLowerCase()) ||
      tx?.type.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleCopy = (hash?: string) => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      toast.success("Transaction hash copied!");
    } else {
      toast.error("No transaction hash available");
    }
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    toast.success("Transaction deleted");
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="p-6">
      <Card className="bg-background shadow-lg border rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            Transactions
          </CardTitle>
          <Input
            placeholder="Search transactions..."
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Addresses</TableHead>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((tx) => (
                <TableRow key={tx?.id}>
                  <TableCell className="font-medium">
                    {tx?.user?.username}
                  </TableCell>
                  <TableCell>{tx?.wallet?.currency} Wallet</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx?.type === "DEPOSIT" ? "default" : "destructive"
                      }
                    >
                      {tx?.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx?.amount}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="truncate max-w-[120px]">
                        From: {tx?.fromAddress}
                      </p>
                      <p className="truncate max-w-[120px]">
                        To: {tx?.toAddress}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[120px]">
                    {tx?.txHash || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx?.status === "COMPLETED"
                          ? "success"
                          : tx?.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {tx?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(tx?.createdAt)}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/transactions/${tx?.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
