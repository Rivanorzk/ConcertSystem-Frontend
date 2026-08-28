import UserLayout from "@/components/userLayout";
import RoleGuard from "@/components/roleGuard";

export default function SuperadminLayout({ children }) {
    return (
        <RoleGuard allow={["superadmin"]}>
            <UserLayout>{children}</UserLayout>
        </RoleGuard>
    );
}
