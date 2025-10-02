"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  CreditCard,
  Trash2,
  Pencil,
  Search,
  Loader2,
  Loader,
  LoaderCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
} from "@/lib/utils";
import { useAlert } from "@/hooks/useAlert";
import { toast, Toaster } from "sonner";

// Define type
type PaymentMethodType = {
  id: string;
  name: string;
  offersCount: number;
  createdAt: string;
};

// utils/formatDate.ts
export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short", // "Sep"
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: true, // AM/PM
  });
}

const ITEMS_PER_PAGE = 5;

const PaymentMethod: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
  const [newMethod, setNewMethod] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCreatingNewMethod, setIsCreatingNewMethod] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const { openAlert, closeAlert } = useAlert();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getPaymentMethods();
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        setLoading(false);
        console.log(res?.paymentMethods);
        setPaymentMethods(res?.paymentMethods);
      }
    })();
  }, [router]);

  const filteredMethods = useMemo(() => {
    return paymentMethods?.filter((method: any) =>
      method.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [paymentMethods, search]);

  const totalPages = Math.ceil(filteredMethods.length / ITEMS_PER_PAGE);
  const paginatedMethods = filteredMethods?.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleAdd = async () => {
    if (newMethod.trim() === "") {
      toast.error("Name is required");
      return;
    }

    setIsCreatingNewMethod(true);

    // 🔹 Create a temporary optimistic entry
    const tempId = `temp-${Date.now()}`;
    const optimisticMethod = {
      id: tempId,
      name: newMethod,
      offersCount: 0,
      createdAt: new Date().toISOString(),
    };

    setPaymentMethods((prev) => [optimisticMethod, ...prev]); // add immediately
    setNewMethod("");
    setOpen(false);

    try {
      const res = await createPaymentMethod(newMethod);

      if (res?.error) {
        // 🔹 Rollback if failed
        setPaymentMethods((prev) => prev.filter((m) => m.id !== tempId));
        toast.error(res?.message || "Failed to create payment method");
      } else if (res?.success && res?.paymentMethod) {
        // 🔹 Replace temp with actual from backend
        setPaymentMethods((prev) =>
          prev.map((m) => (m.id === tempId ? res.paymentMethod : m))
        );
        toast.success(res?.message || "Payment method created successfully");
      }
    } catch (error: any) {
      setPaymentMethods((prev) => prev.filter((m) => m.id !== tempId)); // rollback
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsCreatingNewMethod(false);
    }
  };

  const handleDelete = async (id: string) => {
    // 🔹 Optimistically remove the item
    const prevMethods = paymentMethods;
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(id);

    try {
      const res = await deletePaymentMethod(id);

      if (res?.error) {
        // 🔹 Rollback if failed
        setPaymentMethods(prevMethods);
        toast.error(res?.message || "Failed to delete payment method");
      } else if (res?.success) {
        toast.success(res?.message || "Payment method deleted successfully");
      }
    } catch (error: any) {
      // 🔹 Rollback if error
      setPaymentMethods(prevMethods);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setDeletingId(null);
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
            <CreditCard className="w-6 h-6 text-primary" />
            Payment Methods
          </CardTitle>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search methods..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // reset pagination on search
                }}
                className="pl-8"
              />
            </div>

            {/* Add New Button */}
            <Dialog modal open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Enter payment method name"
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={isCreatingNewMethod} onClick={handleAdd}>
                    {isCreatingNewMethod ? (
                      <LoaderCircleIcon className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Offers</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMethods.map((method: any) => (
                <TableRow key={method?.id}>
                  <TableCell className="font-medium">{method?.name}</TableCell>
                  <TableCell>{method?.offersCount}</TableCell>
                  <TableCell>{formatDate(method?.createdAt)}</TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    {/* <Button size="sm" variant="outline">
                      <Pencil className="w-4 h-4" />
                    </Button> */}
                    <Button
                      disabled={deletingId === method?.id}
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(method?.id)}
                    >
                      {deletingId === method?.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedMethods?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                  >
                    No payment methods found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
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

export default PaymentMethod;
