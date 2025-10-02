"use client";
import React, { useEffect, useState } from "react";
import { RefreshCcw, Trash2, Eye, Loader2Icon } from "lucide-react";
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
import { getSwaps } from "@/lib/utils";
import { toast } from "sonner";
import { formatDate } from "../payment_method/page";

// Dummy data (replace with API fetch)
const initialSwaps = [
  {
    id: "1",
    user: "John Doe",
    fromCoin: "BTC",
    toCoin: "USDT",
    fromAmount: 0.01,
    toAmount: 270,
    createdAt: "2025-09-20",
  },
  {
    id: "2",
    user: "Jane Smith",
    fromCoin: "ETH",
    toCoin: "USDT",
    fromAmount: 0.5,
    toAmount: 850,
    createdAt: "2025-09-21",
  },
  {
    id: "3",
    user: "Mike Johnson",
    fromCoin: "USDT",
    toCoin: "BTC",
    fromAmount: 500,
    toAmount: 0.018,
    createdAt: "2025-09-25",
  },
];

const ITEMS_PER_PAGE = 5;

const SwapsPage = () => {
  const [swaps, setSwaps] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getSwaps();
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        setLoading(false);
        setSwaps(res?.swaps);
      }
    })();
  }, []);

  const filtered = swaps?.filter(
    (s) =>
      s?.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      s?.fromCoin.toLowerCase().includes(search.toLowerCase()) ||
      s?.toCoin.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    setSwaps(swaps?.filter((s) => s.id !== id));
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="p-6">
      <Card className="bg-background shadow-lg border rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <RefreshCcw className="w-6 h-6 text-primary" />
            Swaps
          </CardTitle>
          <Input
            placeholder="Search swaps..."
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
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>From Amount</TableHead>
                <TableHead>To Amount</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((swap) => (
                <TableRow key={swap?.id}>
                  <TableCell className="font-medium">
                    {swap?.user?.username}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{swap?.fromCoin}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{swap?.toCoin}</Badge>
                  </TableCell>
                  <TableCell>{swap?.fromAmount}</TableCell>
                  <TableCell>{swap?.toAmount}</TableCell>
                  <TableCell>{formatDate(swap?.createdAt)}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(swap?.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginated?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No swaps found
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

export default SwapsPage;
