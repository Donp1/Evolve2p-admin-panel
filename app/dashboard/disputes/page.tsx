"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Gavel,
  AlertTriangle,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getDisputes } from "@/lib/utils";
import { toast } from "sonner";
import { formatId } from "@/constant";
import { formatDate } from "../payment_method/page";
import Link from "next/link";
import Image from "next/image";

// Prisma Enum Reference
type DisputeStatus =
  | "OPEN"
  | "RESOLVED_BUYER"
  | "RESOLVED_SELLER"
  | "CANCELLED";

const ITEMS_PER_PAGE = 5;

const DisputesPage = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getDisputes();
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        setLoading(false);
        setDisputes(res?.disputes);
      }
    })();
  }, []);

  const filteredDisputes = useMemo(() => {
    return disputes.filter(
      (d) =>
        d?.reason.toLowerCase().includes(search.toLowerCase()) ||
        d?.openedBy.toLowerCase().includes(search.toLowerCase()) ||
        d?.tradeId.toLowerCase().includes(search.toLowerCase()) ||
        d?.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [disputes, search]);

  const totalPages = Math.ceil(filteredDisputes.length / ITEMS_PER_PAGE);
  const paginatedDisputes = filteredDisputes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-yellow-500" /> Open
          </Badge>
        );

      case "RESOLVED_BUYER":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Awarded Buyer
          </Badge>
        );

      case "RESOLVED_SELLER":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Awarded Seller
          </Badge>
        );

      case "CANCELLED":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelled
          </Badge>
        );

      default:
        return null;
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
      <Card className="bg-background border rounded-2xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" />
            Disputes Management
          </CardTitle>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search disputes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-64"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade ID</TableHead>
                <TableHead>Opened By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDisputes?.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{formatId(d.tradeId)}</TableCell>
                  <TableCell>{d?.user?.username}</TableCell>
                  <TableCell>{d?.reason}</TableCell>
                  <TableCell>{getStatusBadge(d?.status)}</TableCell>
                  <TableCell>
                    <Link
                      href={d?.evidence}
                      target="_blank"
                      className="text-green-500 underline"
                    >
                      proof
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(d?.createdAt)}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    {/* View details */}
                    {/* <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Dispute Details</DialogTitle>
                        </DialogHeader>
                        <p>
                          <strong>Reason:</strong> {d.reason}
                        </p>
                        {d.description && (
                          <p>
                            <strong>Description:</strong> {d?.description}
                          </p>
                        )}
                        {d.evidence && (
                          <div className="mt-4">
                            <strong>Evidence:</strong>
                            <img
                              src={d?.evidence}
                              alt="Evidence"
                              className="mt-2 rounded-lg border size-80 object-cover"
                            />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog> */}

                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/disputes/${d?.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedDisputes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-6"
                  >
                    No disputes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || totalPages === 0}
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

export default DisputesPage;
