"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2Icon, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdmin, getAdmins } from "@/lib/utils";
import { toast } from "sonner";
import { formatDate } from "../payment_method/page";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ADMIN_ROLES = [
  // { value: "SUPERADMIN", label: "Super Admin" },
  { value: "SUPPORT", label: "Support" },
  { value: "COMPLIANCE", label: "Compliance" },
];

const AdminsPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: "1",
      name: "John Doe",
      email: "admin1@example.com",
      role: "Super Admin",
      createdAt: "2025-09-21",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "admin2@example.com",
      role: "Moderator",
      createdAt: "2025-10-01",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    const res = await createAdmin(
      newAdmin.email,
      newAdmin.name,
      newAdmin.password,
      newAdmin.role
    );
    if (res?.error) {
      toast.error(res?.message || "Failed to create admin");
      setIsCreating(false);
      return;
    }

    if (res?.success) {
      setIsCreating(false);
      toast.success(res?.message || "Admin created successfully");
      setNewAdmin({ name: "", email: "", role: "", password: "" });
      setIsModalOpen(false);
      setReload((prev) => prev + 1);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAdmins();
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message || "Failed to fetch admins");
        return;
      }

      if (res?.success) {
        setAdmins(res?.admins || []);
        setLoading(false);
      }
    })();
  }, [reload]);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Admin Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus size={18} /> New Admin
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-800 shadow-md">
          <table className="min-w-full bg-[#121217]">
            <thead>
              <tr className="text-gray-400 text-sm uppercase tracking-wide border-b border-gray-700">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="hover:bg-[#1c1c22] transition-colors border-b border-gray-800"
                >
                  <td className="py-3 px-6">{admin.name}</td>
                  <td className="py-3 px-6 text-gray-300">{admin.email}</td>
                  <td className="py-3 px-6">
                    <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-400">
                    {formatDate(admin.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#18181e] p-6 rounded-2xl w-[90%] max-w-md border border-gray-800 shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Admin</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-[#101015] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 bg-[#101015] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                />

                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 bg-[#101015] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                />

                <div>
                  <Select>
                    <SelectTrigger className="w-full px-4 py-2 bg-[#101015] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-purple-500">
                      <SelectValue placeholder="Select admin role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a22] text-white border-gray-700">
                      {ADMIN_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <button
                  disabled={isCreating}
                  onClick={handleCreateAdmin}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 py-2 rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center"
                >
                  {isCreating ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    "Create Admin"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminsPage;
