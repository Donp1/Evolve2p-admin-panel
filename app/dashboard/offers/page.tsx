"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, BadgeDollarSign, Loader2Icon } from "lucide-react";
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
import { getOffers, performOfferAction } from "@/lib/utils";
import { toast } from "sonner";
import { formatDate } from "../payment_method/page";

// Offer type
type Offer = {
  id: string;
  userId: string;
  type: "BUY" | "SELL";
  crypto: string;
  currency: string;
  margin: number;
  minLimit: number;
  maxLimit: number;
  terms?: string;
  time: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  paymentMethod: { name: string };
  user: { username: string };
};

// Dummy data (replace with API fetch)
const initialOffers: Offer[] = [
  {
    id: "1",
    userId: "u1",
    type: "BUY",
    crypto: "BTC",
    currency: "USD",
    margin: 2.5,
    minLimit: 50,
    maxLimit: 1000,
    terms: "Quick trade only",
    time: "15 min",
    status: "ACTIVE",
    createdAt: "2025-09-20",
    paymentMethod: { name: "Bank Transfer" },
    user: { username: "john_doe" },
  },
  {
    id: "2",
    userId: "u2",
    type: "SELL",
    crypto: "USDT",
    currency: "NGN",
    margin: 1.2,
    minLimit: 1000,
    maxLimit: 50000,
    terms: "Fast release",
    time: "30 min",
    status: "INACTIVE",
    createdAt: "2025-09-25",
    paymentMethod: { name: "PayPal" },
    user: { username: "sandy" },
  },
];

const ITEMS_PER_PAGE = 5;

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getOffers();

      if (res?.error) {
        setLoading(false);
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        setLoading(false);
        setOffers(res?.offers);
        console.log(res?.offers);
      }
    })();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers?.filter((offer) =>
      `${offer?.crypto} ${offer?.currency} ${offer?.paymentMethod?.name} ${offer?.user?.username}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [offers, search]);

  const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
  const paginatedOffers = filteredOffers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Toggle status ACTIVE <-> INACTIVE
  const handleToggleStatus = async (id: string) => {
    // 1. Optimistically update UI
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id
          ? {
              ...offer,
              status: offer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : offer
      )
    );

    // 2. Decide action type
    const actionType =
      offers.find((offer) => offer.id === id)?.status === "ACTIVE"
        ? "inactive"
        : "active";

    try {
      // 3. Call backend
      const res = await performOfferAction(actionType, id);

      if (res?.error) {
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        toast.success(res?.message);
        return;
      }
    } catch (error) {
      console.error("Failed to update offer:", error);

      // 4. Rollback on error
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === id
            ? {
                ...offer,
                status: offer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE", // revert back
              }
            : offer
        )
      );
    }
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
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BadgeDollarSign className="w-6 h-6 text-primary" />
            Offers
          </CardTitle>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
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
                <TableHead>User</TableHead>
                <TableHead>Crypto</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOffers.map((offer) => (
                <TableRow key={offer?.id}>
                  <TableCell className="font-medium">
                    {offer.user.username}
                  </TableCell>
                  <TableCell>{offer?.crypto}</TableCell>
                  <TableCell>{offer?.currency}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        offer?.type === "BUY" ? "default" : "destructive"
                      }
                    >
                      {offer?.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{offer.margin}%</TableCell>
                  <TableCell>
                    {offer?.minLimit} - {offer?.maxLimit}
                  </TableCell>
                  <TableCell>{offer?.paymentMethod?.name}</TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        offer?.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {offer?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(offer?.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={
                        offer?.status === "ACTIVE" ? "destructive" : "outline"
                      }
                      onClick={() => handleToggleStatus(offer?.id)}
                    >
                      {offer?.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedOffers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground py-6"
                  >
                    No offers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
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

export default OffersPage;
