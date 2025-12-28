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
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 New state for search

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

  // Filter users based on search query (by email)
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("User deleted successfully");
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === id ? { ...user, role: newRole } : user))
        );
        toast.success(`Role updated to ${newRole}`);
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-xl">Connecting...</div>;

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        
        {/* 🔍 Search Bar Input */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by email..."
            className="input input-bordered w-full pl-10 shadow-sm focus:border-info"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition border-b">
                  <td>{index + 1}</td>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge p-3 font-semibold ${
                        user.role === 'admin' ? 'badge-secondary' : 
                        user.role === 'rider' ? 'badge-success' : 'badge-primary'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="flex gap-3">
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      {user.role === 'admin' ? "Make User" : "Make Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500 font-medium">
                  No users found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersPage;