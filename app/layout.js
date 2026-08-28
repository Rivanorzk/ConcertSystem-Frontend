import "./globals.css";

import { AuthProvider } from "@/contexts/authContext";
import { Toaster } from "sonner";

export const metadata = {
    title: "Eventify",
    description: "Platform Pemesanan Tiket Konser",
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body>
                <AuthProvider>
                    {children}

                    <Toaster
                        position="top-right"
                        richColors
                    />
                </AuthProvider>
            </body>
        </html>
    );
}