"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AllUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { cache: 'no-store' });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete Logic
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user from the database?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("User deleted from MongoDB");
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  // Role Update Logic
  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        // Update local state immediately so it reflects on UI
        setUsers((prev) =>
          prev.map((user) => (user._id === id ? { ...user, role: newRole } : user))
        );
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error("Failed to update role in database");
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-xl">Connecting to Database...</div>;

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Management</h1>

      <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-200">
        <table className="table w-full bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50 transition border-b">
                <td>{index + 1}</td>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge p-3 font-semibold ${user.role === 'admin' ? 'badge-secondary' : 'badge-primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="flex gap-3">
                  <button 
                    onClick={() => handleRoleChange(user._id, user.role)}
                    className="btn btn-sm btn-outline btn-info"
                  >
                    Change to {user.role === 'admin' ? "User" : "Admin"}
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersPage;