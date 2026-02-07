"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Image from "next/image";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  Edit,
  Package,
  Search,
  Pill,
  Trash2, 
} from "lucide-react";
import { OrdersTableSkeleton } from "@/components/OrdersTableSkeleton";

/* ---------------- API Functions ---------------- */
const fetchSellerMedicines = async () => {
  const res = await api.get("/medicines/seller");
  return res.data.medicines || res.data;
};

const updateMedicine = async ({ id, data }: { id: string; data: any }) => {
  const res = await api.put(`/medicines/${id}`, data);
  return res.data;
};


const deleteMedicine = async (id: string) => {
  const res = await api.delete(`/medicines/${id}`);
  return res.data;
};

/* ---------------- Component ---------------- */
const SellerMedicinePage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // get medicine
  const { data: medicines, isLoading } = useQuery({
    queryKey: ["seller-medicines"],
    queryFn: fetchSellerMedicines,
  });

  // update
  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateMedicine,
    onSuccess: () => {
      toast.success("Medicine updated!");
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      setIsEditDialogOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Update failed"),
  });

  // Delete
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      toast.success("Medicine deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Delete failed"),
  });

  const filteredMedicines = Array.isArray(medicines)
    ? medicines.filter((med: any) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  if (isLoading) {
    return (
     <OrdersTableSkeleton></OrdersTableSkeleton>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Medicine Inventory
        </h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicine..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((med: any) => (
              <TableRow key={med.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded overflow-hidden border">
                      {med.image ? (
                        <Image
                          src={med.image}
                          alt={med.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Pill className="h-full w-full p-2 text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-semibold">{med.name}</span>
                  </div>
                </TableCell>
                <TableCell>৳{med.price}</TableCell>
                <TableCell>
                  <Badge variant={med.stock > 10 ? "outline" : "destructive"}>
                    {med.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedMedicine(med);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedMedicine(med);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedMedicine?.name}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              handleUpdate({
                id: selectedMedicine.id,
                data: {
                  stock: Number(e.target.stock.value),
                  price: Number(e.target.price.value),
                },
              });
            }}
            className="space-y-4"
          >
            <Input
              name="stock"
              type="number"
              defaultValue={selectedMedicine?.stock}
            />
            <Input
              name="price"
              type="number"
              defaultValue={selectedMedicine?.price}
            />
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete <b>{selectedMedicine?.name}</b> from
              your inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedMedicine.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Delete Medicine"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerMedicinePage;
