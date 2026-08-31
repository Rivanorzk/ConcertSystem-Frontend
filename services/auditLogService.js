// services/auditLogService.js
import api from "@/lib/api";

/**
 * [SUPERADMIN] Ambil audit log dengan filter & pagination opsional.
 * params: { action, entity_type, page, limit }
 */
export const getAuditLogs = async (params = {}) => {
    const { data } = await api.get("/audit-logs", { params });
    return data.data; // { rows, total, page, limit }
};