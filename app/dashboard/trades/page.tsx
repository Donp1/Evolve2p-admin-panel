"use client";
import React, { useEffect, useState } from "react";
import {
  Eye,
  Unlock,
  XCircle,
  Trash2,
  CheckCircle,
  Search,
  Gavel,
  Scale,
  Loader2,
} from "lucide-react";
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
import { getTrades } from "@/lib/utils";
import { formatDate } from "../payment_method/page";

// Trade status enum
type TradeStatus =
  | "PENDING"
  | "PAID"
  | "RELEASED"
  | "DISPUTED"
  | "COMPLETED"
  | "CANCELLED";

type Trade = {
  id: string;
  buyer: string;
  seller: string;
  offer: string;
  status: TradeStatus;
  amountFiat: number;
  amountCrypto: number;
  escrowReleased: boolean;
  paymentProof?: string;
  createdAt: string;
};

// Dummy data
const initialTrades: Trade[] = [
  {
    id: "1",
    buyer: "John Doe",
    seller: "Alice",
    offer: "BTC for USD",
    status: "PENDING",
    amountFiat: 500,
    amountCrypto: 0.012,
    escrowReleased: false,
    createdAt: "2025-09-20",
  },
  {
    id: "2",
    buyer: "Mark",
    seller: "Jane",
    offer: "USDT for NGN",
    status: "PAID",
    amountFiat: 120000,
    amountCrypto: 200,
    escrowReleased: false,
    paymentProof: "https://example.com/proof.png",
    createdAt: "2025-09-21",
  },
  {
    id: "3",
    buyer: "Sam",
    seller: "Daniel",
    offer: "ETH for USD",
    status: "COMPLETED",
    amountFiat: 1000,
    amountCrypto: 0.4,
    escrowReleased: true,
    createdAt: "2025-09-25",
  },
];

const ITEMS_PER_PAGE = 5;

const TradesPage = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getTrades();

      if (res?.error) {
        toast.error(res?.message);
        setLoading(false);
        return;
      }

      if (res?.success) {
        setTrades(res?.trades);
        setLoading(false);
      }
    })();
  }, []);

  const filtered = trades.filter(
    (t) =>
      t?.buyer?.username?.toLowerCase().includes(search.toLowerCase()) ||
      t?.seller?.username?.toLowerCase().includes(search.toLowerCase()) ||
      t?.offer?.crypto?.toLowerCase().includes(search.toLowerCase()) ||
      t?.offer?.currency?.toLowerCase().includes(search.toLowerCase()) ||
      t?.status?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleAction = (id: string, action: string) => {
    toast.success(`Trade ${action} (id: ${id})`);
  };

  const getStatusVariant = (status: TradeStatus) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "secondary";
      case "PAID":
        return "default";
      case "RELEASED":
        return "outline";
      case "DISPUTED":
        return "destructive";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
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
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            Trades
          </CardTitle>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Amount (Fiat)</TableHead>
                <TableHead>Amount (Crypto)</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Proof</TableHead> */}
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((trade) => (
                <TableRow key={trade?.id}>
                  <TableCell className="font-medium">
                    {trade?.buyer?.username}
                  </TableCell>
                  <TableCell>{trade?.seller?.username}</TableCell>
                  <TableCell>
                    {trade?.offer?.type == "SELL" ? "BUY" : "SELL"}
                  </TableCell>
                  <TableCell>
                    {trade?.offer?.currency} {trade?.amountFiat}
                  </TableCell>
                  <TableCell>
                    {trade?.amountCrypto} {trade?.offer?.crypto}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={getStatusVariant(trade?.status)}
                    >
                      {trade.status}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>
                    {trade.paymentProof ? (
                      <a
                        href={trade.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline text-xs"
                      >
                        View Proof
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell> */}
                  <TableCell>{formatDate(trade?.createdAt)}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {trade?.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleAction(trade?.id, "Marked as Paid")
                        }
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    {trade?.status === "PAID" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleAction(trade?.id, "Released Escrow")
                        }
                      >
                        <Unlock className="w-4 h-4" />
                      </Button>
                    )}
                    {trade?.status === "DISPUTED" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleAction(trade?.id, "Resolved Dispute")
                        }
                      >
                        <Gavel className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(trade?.id, "Deleted")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No trades found
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

export default TradesPage;
