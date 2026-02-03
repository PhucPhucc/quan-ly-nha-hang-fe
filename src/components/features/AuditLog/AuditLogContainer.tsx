"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/services/auditService";
import { OrderAuditLog } from "@/types/Order";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import AuditLogTable from "./AuditLogTable";

interface AuditLogContainerProps {
  employeeId?: string;
}

const AuditLogContainer = ({ employeeId }: AuditLogContainerProps) => {
  const [logs, setLogs] = useState<OrderAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getAuditLogs(employeeId);
        console.log("Audit log raw data:", data);
        // Assuming API returns an object with items array
        setLogs(data.items || data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [employeeId]);

  return (
    <div className="flex-1 overflow-auto mt-4 px-1">
      <AuditLogTable logs={logs} loading={loading} error={error} />
    </div>
  );
};

export default AuditLogContainer;
