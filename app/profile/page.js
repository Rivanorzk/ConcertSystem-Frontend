// app/profile/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    CalendarDays,
    Edit3,
    LockKeyhole,
    Camera,
    CheckCircle,
    XCircle,
    ArrowLeft,
} from "lucide-react";

import { getProfile } from "@/services/userService";
import { logout } from "@/services/authService";
import SectionHeader from "@/components/sectionHeader";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import EditProfileModal from "@/components/editProfileModal";
import { toast } from "react-hot-toast";
import { uploadAvatar } from "@/services/userService";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Failed to load profile:", err);
            setError(err?.response?.data?.message || "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
    }

    try {
        setUploadingAvatar(true);
        const data = await uploadAvatar(file);
        setProfile({
            ...profile,
            profile_image: data.profile_image,
        });
        toast.success("Profile photo updated!");
    } catch (error) {
        console.error("Upload avatar error:", error);
        toast.error(error?.response?.data?.message || "Failed to upload photo");
    } finally {
        setUploadingAvatar(false);
        e.target.value = "";
    }
};

    const handleUpdateProfile = (updatedData) => {
        setProfile({
            ...profile,
            ...updatedData,
        });
    };

    const getDashboardUrl = () => {
        const role = profile?.role?.toLowerCase();
        switch (role) {
            case "admin":
                return "/admin/dashboard";
            case "superadmin":
                return "/superadmin/dashboard";
            default:
                return "/customer/dashboard";
        }
    };

    const getInitial = () => {
        return profile?.username?.charAt(0)?.toUpperCase() || "U";
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "superadmin": return "Super Admin";
            case "admin": return "Administrator";
            default: return "Customer";
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        }
    };

    if (loading) {
        return (
            <div>
                <SectionHeader
                    title="My Profile"
                    description="Manage your account information"
                />
                <div className="mt-8">
                    <LoadingSpinner text="Loading profile..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <SectionHeader
                    title="My Profile"
                    description="Manage your account information"
                />
                <div className="mt-8">
                    <EmptyState title="Something went wrong" description={error} />
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const roleLabel = getRoleLabel(profile.role);
    const dashboardUrl = getDashboardUrl();

    return (
        <>
            <div>
                <SectionHeader
                    title="My Profile"
                    description="Manage your Eventify account information"
                />

                {/* Profile Card */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5D6D0] bg-white">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-[#5B0F18] to-[#8B2635]" />

                    <div className="px-6 pb-6 md:px-8">
                        <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                {/* Avatar dengan hover overlay */}
                                <div className="relative group">
                                    {profile.profile_image ? (
                                        <img
                                            src={profile.profile_image}
                                            alt={profile.username}
                                            className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-md"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-[#F1E4DC] text-4xl font-bold text-[#7A1F2B] shadow-md">
                                            {getInitial()}
                                        </div>
                                    )}

                                    {/* Overlay ganti foto */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingAvatar}
                                        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <div className="flex flex-col items-center gap-1 text-white">
                                            {uploadingAvatar ? (
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Camera className="w-6 h-6" />
                                                    <span className="text-xs font-medium">Change Photo</span>
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </div>

                                <div className="pb-1">
                                    <h2 className="text-2xl font-bold text-[#1E1E1E]">
                                        {profile.username}
                                    </h2>
                                    <p className="mt-1 text-sm text-[#8C7777]">
                                        {roleLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => router.push(dashboardUrl)}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5D6D0] px-5 text-sm font-semibold text-[#5B0F18] transition hover:bg-[#F8F1E7]"
                                >
                                    <ArrowLeft size={17} />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setEditModalOpen(true)}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5B0F18] px-5 text-sm font-semibold text-white transition hover:bg-[#7A1F2B]"
                                >
                                    <Edit3 size={17} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information & Status */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-2xl border border-[#E5D6D0] bg-white p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-[#1E1E1E]">
                                Account Information
                            </h2>
                            <p className="mt-1 text-sm text-[#8C7777]">
                                Your personal account details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <InfoItem icon={User} label="Username" value={profile.username} />
                            <InfoItem icon={Mail} label="Email" value={profile.email} />
                            <InfoItem icon={Phone} label="Phone" value={profile.phone || "-"} />
                            <InfoItem icon={ShieldCheck} label="Role" value={roleLabel} />
                            <InfoItem icon={CalendarDays} label="Joined" value={formatDate(profile.created_at)} />
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="rounded-2xl border border-[#E5D6D0] bg-white p-6">
                        <h2 className="text-lg font-bold text-[#1E1E1E]">
                            Account Status
                        </h2>

                        <div className="mt-5 space-y-4">
                            <div className="rounded-xl bg-[#FCF8F4] p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#9A8585]">
                                    Account
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    {profile.is_active ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="text-sm font-semibold text-[#1E1E1E]">
                                        {profile.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl bg-[#FCF8F4] p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#9A8585]">
                                    Status
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${
                                            profile.status === "online"
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                        }`}
                                    />
                                    <span className="text-sm font-semibold capitalize text-[#1E1E1E]">
                                        {profile.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security & Logout */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Security Info */}
                    <div className="rounded-2xl border border-[#E5D6D0] bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E8E4] text-[#7A1F2B]">
                                <LockKeyhole size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-[#1E1E1E]">Password</h2>
                                <p className="text-sm text-[#8C7777]">
                                    Click "Edit Profile" above to change your password.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="rounded-2xl border border-[#E5D6D0] bg-white p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="font-bold text-[#1E1E1E]">Sign Out</h2>
                                <p className="text-sm text-[#8C7777]">
                                    Logout from your account on all devices.
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Profile */}
            <EditProfileModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                profile={profile}
                onUpdate={handleUpdateProfile}
            />
        </>
    );
}

// ============================================
// InfoItem Component
// ============================================
function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-[#EDE1DB] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8F0EB] text-[#7A1F2B]">
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9A8585]">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-[#1E1E1E]">
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}