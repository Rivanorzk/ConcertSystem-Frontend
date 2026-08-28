// components/EditProfileModal.js
"use client";

import { useState } from "react";
import { X, User, Mail, Phone, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { updateProfile, changePassword } from "@/services/userService";
import { toast } from "react-hot-toast";

export default function EditProfileModal({ isOpen, onClose, profile, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: profile?.username || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Jika password fields diisi, validasi
        if (formData.new_password || formData.current_password || formData.confirm_password) {
            if (!formData.current_password) {
                newErrors.current_password = "Current password is required";
            }
            if (formData.new_password.length < 6) {
                newErrors.new_password = "Password must be at least 6 characters";
            }
            if (formData.new_password !== formData.confirm_password) {
                newErrors.confirm_password = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);

            // 1. Update profile (username, email, phone)
            await updateProfile({
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
            });

            // 2. If password fields are filled, change password
            if (formData.new_password) {
                await changePassword({
                    currentPassword: formData.current_password,
                    newPassword: formData.new_password,
                });
            }

            toast.success("Profile updated successfully!");
            onUpdate({
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
            });
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            const msg = error?.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1E1E1E]">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-[#F8F1E7] transition"
                    >
                        <X className="w-5 h-5 text-[#737373]" />
                    </button>
                </div>

                <p className="text-sm text-[#737373] -mt-4 mb-6">
                    Update your account information. Fill password fields only if you want to change password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                                    errors.username ? "border-red-500" : "border-[#E5D6D0]"
                                } focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 outline-none transition`}
                                required
                            />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                                    errors.email ? "border-red-500" : "border-[#E5D6D0]"
                                } focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 outline-none transition`}
                                required
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
                            Phone
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5D6D0] focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#E5D6D0]" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-[#737373]">Password (optional)</span>
                        </div>
                    </div>

                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
                            Current Password
                        </label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                            <input
                                type={showCurrent ? "text" : "password"}
                                name="current_password"
                                value={formData.current_password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                                    errors.current_password ? "border-red-500" : "border-[#E5D6D0]"
                                } focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 outline-none transition`}
                                placeholder="Required if changing password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1E1E1E]"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                                    errors.new_password ? "border-red-500" : "border-[#E5D6D0]"
                                } focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 outline-none transition`}
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1E1E1E]"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.new_password && <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                                    errors.confirm_password ? "border-red-500" : "border-[#E5D6D0]"
                                } focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 outline-none transition`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1E1E1E]"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-semibold hover:bg-[#7A1F2B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}