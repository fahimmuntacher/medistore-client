"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryFormModal } from "./CategoryModal";
import { DeleteConfirmModal } from "./AlertDialog";
import { OrdersTableSkeleton } from "@/components/OrdersTableSkeleton";
import { PaginationControls } from "@/components/Medicines/PaginationControls";

const AdminCategoryPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // 1. Fetch Categories
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", searchTerm, page],
    queryFn: async () => {
      const res = await api.get("/categories", {
        params: { search: searchTerm, page, limit: 10 },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const categories = data?.categories || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // 2. Add/Edit Mutation
  const formMutation = useMutation({
    mutationFn: async (values: any) => {
      return modalMode === "add"
        ? api.post("/categories", values)
        : api.put(`/categories/${selectedCategory.id}`, values);
    },
    onSuccess: () => {
      toast.success(
        `Category ${modalMode === "add" ? "added" : "updated"} successfully!`,
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsFormOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Operation failed"),
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsDeleteOpen(false);
    },
    onError: (err: any) =>
      toast.error("Failed to delete category (403: Admin Access Only)"),
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Medicine Categories
          </h1>
          <p className="text-muted-foreground text-sm">
            Total: {data?.pagination?.total || 0} categories
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // সার্চ করলে ১ নম্বর পেজে রিসেট হবে
              }}
            />
          </div>
          <Button
            onClick={() => {
              setModalMode("add");
              setSelectedCategory(null);
              setIsFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <OrdersTableSkeleton />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat: any) => (
                <TableRow
                  key={cat.id}
                  className={isFetching ? "opacity-50 transition-opacity" : ""}
                >
                  <TableCell>
                    <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <Layers className="h-5 w-5" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {cat.name}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-100 p-1 rounded">
                      {cat.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setModalMode("edit");
                        setSelectedCategory(cat);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Pagination Controls */}
      {!isLoading && categories.length > 0 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* Modals */}
      {isFormOpen && (
        <CategoryFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          mode={modalMode}
          initialData={selectedCategory}
          isLoading={formMutation.isPending}
          onSubmit={(values) => formMutation.mutate(values)}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={selectedCategory?.name}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(selectedCategory.id)}
      />
    </div>
  );
};

export default AdminCategoryPage;
