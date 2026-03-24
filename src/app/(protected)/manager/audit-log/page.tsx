import { Metadata } from "next";

import SystemAuditLogPage from "@/components/features/AuditLog/SystemAuditLogPage";

export const metadata: Metadata = {
  title: "Audit Log | Manager | FoodHub",
  description: "Theo doi lich su thay doi reservation va table trong he thong FoodHub",
};

export default function ManagerAuditLogRoute() {
  return <SystemAuditLogPage />;
}
