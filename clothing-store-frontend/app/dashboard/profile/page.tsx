"use client";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { jwtDecode } from "jwt-decode";
import { RxTokens } from "react-icons/rx";
import { PiHockey } from "react-icons/pi";
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("token");
  console.log('Token is', token)
  useEffect(() => {
    if (token) {
      console.log("Token found:", token);
      try {
        const decoded: any = jwtDecode(token);
        const userObj = {
          _id: decoded.sub,
          createdAt: decoded.createdAt,
          updatedAt: decoded.updatedAt,
          username: decoded.username,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          address: decoded.address,
          phoneNumber: decoded.phoneNumber,
        };
        setUser(userObj as User);
        setFormData({
          username: userObj.username,
          email: userObj.email,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          address: userObj.address,
          phoneNumber: userObj.phoneNumber,
        });
        console.log("Decoded user data:", decoded);
      } catch {
        setUser(null);
      }
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("No user data to save");
      return;
    }
    if (!formData.username || !formData.email) {
      setError("Username and Email are required.");
      return;
    }
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          username: formData.username,
          email: formData.email, 
        }),
      });

      if (response.ok) {
        const updatedUserFromServer: User = await response.json();
        setUser(updatedUserFromServer);
        setFormData(updatedUserFromServer); 

        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        setError(errorData.message || "Failed to save changes. Please try again.");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err: any) {
      console.error("Network or fetch error:", err);
      setError("Network error. Could not connect to the server.");
      setTimeout(() => setError(""), 5000);
    }
  };
  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Profile
      </h2>

      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveChanges} className="space-y-6">
        {/* Read-only fields */}
        <div>
          <label
            htmlFor="_id"
            className="block text-sm font-medium text-gray-700"
          >
            User ID
          </label>
          <input
            type="text"
            id="_id"
            name="_id"
            value={user?._id || ""}
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="createdAt"
            className="block text-sm font-medium text-gray-700"
          >
            Created At
          </label>
          <input
            type="text"
            id="createdAt"
            name="createdAt"
            value={
              user?.createdAt ? new Date(user.createdAt).toLocaleString() : ""
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="updatedAt"
            className="block text-sm font-medium text-gray-700"
          >
            Last Updated At
          </label>
          <input
            type="text"
            id="updatedAt"
            name="updatedAt"
            value={
              user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : ""
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            readOnly
          />
        </div>

        {/* Editable fields */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Save Changes Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
