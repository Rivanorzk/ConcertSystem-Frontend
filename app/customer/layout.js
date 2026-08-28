import UserLayout from "@/components/userLayout";
import RoleGuard from "@/components/roleGuard";

export default function CustomerLayout({ children }) {
    return (
        <RoleGuard allow={["customer"]}>
            <UserLayout>{children}</UserLayout>
        </RoleGuard>
    );
}
