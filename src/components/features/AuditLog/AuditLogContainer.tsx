"use client";

import { useEffect, useState } from "react";

import { getErrorMessage } from "@/lib/error";
import { getAuditLogs, SystemAuditLog } from "@/services/auditService";

import { AuditLogDetailSheet } from "./AuditLogDetailSheet";
import { AuditLogTable } from "./AuditLogTable";

interface AuditLogContainerProps {
  employeeId?: string;
}

const AuditLogContainer = ({ employeeId }: AuditLogContainerProps) => {
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<SystemAuditLog | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await getAuditLogs(employeeId);
        if (res.data) {
          // Type casting for now, assuming the backend refactor matches the table structure
          setLogs(res.data.items || []);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [employeeId]);

  const handleOpenDetails = (log: SystemAuditLog) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex-1 min-h-0 mt-4 px-1">
      <AuditLogTable
        logs={logs}
        loading={loading}
        error={error}
        onOpenDetails={handleOpenDetails}
      />
      <AuditLogDetailSheet log={selectedLog} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
};

export default AuditLogContainer;
