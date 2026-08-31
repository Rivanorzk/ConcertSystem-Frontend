// components/crudModal.js
"use client";

import { X } from "lucide-react";

export default function CrudModal({ title, onClose, children, maxWidth = "max-w-lg" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#1E1E1E]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#8C7777] transition hover:bg-[#F8F1E7]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}