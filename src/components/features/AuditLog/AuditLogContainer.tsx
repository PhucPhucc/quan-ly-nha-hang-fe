"use client";

import { useEffect, useState } from "react";

import { getErrorMessage } from "@/lib/error";
import { getAuditLogs } from "@/services/auditService";
import { EmployeeAuditLog } from "@/types/Employee";

import AuditLogTable from "./AuditLogTable";

interface AuditLogContainerProps {
  employeeId?: string;
}

const AuditLogContainer = ({ employeeId }: AuditLogContainerProps) => {
  const [logs, setLogs] = useState<EmployeeAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getAuditLogs(employeeId);
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
