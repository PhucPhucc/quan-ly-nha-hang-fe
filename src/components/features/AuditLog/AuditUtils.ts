import { type VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/ui/badge";
import { formatDateTimeWithBranding } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { SystemAuditLog } from "@/services/auditService";

export type ParsedState = Record<string, unknown>;

export type ChangeItem = {
  key: string;
  label: string;
  oldValue: string;
  newValue: string;
};

// Chỉ ẩn các trường thực sự mang tính quản trị nội bộ dư thừa
const HIDDEN_CHANGE_KEYS = new Set([
  "UpdatedAt",
  "UpdatedBy",
  "CreatedAt",
  "CreatedBy",
  "DeletedAt",
  "IsRevoked", // Ẩn lại vì đây là trường kỹ thuật
  "Expires", // Ẩn lại vì đây là trường kỹ thuật
]);

export function toIsoDateStart(value: string) {
  return value ? new Date(`${value}T00:00:00`).toISOString() : undefined;
}

export function toIsoDateEnd(value: string) {
  return value ? new Date(`${value}T23:59:59.999`).toISOString() : undefined;
}

export function parseJson(value?: string | null): ParsedState {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as ParsedState)
      : { value: parsed };
  } catch {
    return { value };
  }
}

export function formatDateTime(value: string) {
  return formatDateTimeWithBranding(value, undefined, true);
}

export function formatDateOnly(value: string) {
  return formatDateTimeWithBranding(value, undefined, false);
}

function getStringField(state: ParsedState, keys: string[]) {
  for (const key of keys) {
    const value = state[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function formatTableSubjectValue(value: string) {
  const cleaned = value.replace(/[{}"']/g, "").trim();
  if (!cleaned) return null;

  if (/^\d+$/.test(cleaned)) {
    return cleaned.replace(/^0+(?=\d)/, "") || "0";
  }

  const compact = cleaned.replace(/-/g, "");
  if (/^[0-9a-fA-F]+$/.test(compact) && compact.length >= 4) {
    return compact.slice(-4);
  }

  return cleaned;
}

export function formatScalarValue(value: unknown, key?: string) {
  if (value === null || value === undefined || value === "") {
    return UI_TEXT.AUDIT_LOG.MESSAGES.NULL_VALUE;
  }
  if (typeof value === "boolean") {
    return value ? UI_TEXT.AUDIT_LOG.MESSAGES.YES_VALUE : UI_TEXT.AUDIT_LOG.MESSAGES.NO_VALUE;
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (key === "ReservationDate") return formatDateOnly(value);
    if (key === "ReservationTime") return value.slice(0, 5);

    // Thu gọn các chuỗi dài (Token/ID) để hiển thị đẹp hơn
    if (
      value.length > 50 &&
      (key?.toLowerCase().includes("token") || key?.toLowerCase().includes("id"))
    ) {
      return `${value.slice(0, 8)}...${value.slice(-8)}`;
    }

    if (value.length > 80) return `${value.slice(0, 80)}…`;
    return value;
  }
  return JSON.stringify(value);
}

export function getActorLabel(actorInfo?: string | null) {
  if (!actorInfo) return UI_TEXT.COMMON.SYSTEM;
  const parsed = parseJson(actorInfo);
  const type = typeof parsed.type === "string" ? parsed.type : "";

  if (type === "Guest") {
    const name =
      typeof parsed.name === "string" && parsed.name.trim()
        ? parsed.name
        : UI_TEXT.AUDIT_LOG.ACTOR_INFO.GUEST;
    const phone =
      typeof parsed.phone === "string" && parsed.phone.trim() ? ` (${parsed.phone})` : "";
    return `${name}${phone}`;
  }

  if (type === "Employee") {
    const code = typeof parsed.code === "string" && parsed.code.trim() ? parsed.code : null;
    const id = typeof parsed.id === "string" ? parsed.id.slice(0, 8) : null;
    return (
      code ??
      (id
        ? UI_TEXT.AUDIT_LOG.ACTOR_INFO.EMPLOYEE_ID.replace("{id}", id)
        : UI_TEXT.AUDIT_LOG.ACTOR_INFO.EMPLOYEE)
    );
  }

  return UI_TEXT.COMMON.SYSTEM;
}

export function getActorSubLabel(actorInfo?: string | null) {
  const parsed = parseJson(actorInfo);
  if (typeof parsed.type !== "string") return null;

  if (parsed.type === "Guest") return UI_TEXT.AUDIT_LOG.ACTOR_INFO.GUEST_SUB;
  if (parsed.type === "Employee") {
    return typeof parsed.ip === "string"
      ? `${UI_TEXT.AUDIT_LOG.ACTOR_INFO.IP_PREFIX} ${parsed.ip}`
      : UI_TEXT.AUDIT_LOG.ACTOR_INFO.INTERNAL;
  }
  return parsed.type;
}

export function getEntityLabel(entityName: string) {
  switch (entityName) {
    case "Reservation":
      return UI_TEXT.AUDIT_LOG.ENTITIES.RESERVATION;
    case "Table":
      return UI_TEXT.AUDIT_LOG.ENTITIES.TABLE;
    default:
      return entityName;
  }
}

export function getActionLabel(action: string) {
  switch (action.toLowerCase()) {
    case "create":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CREATE;
    case "update":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.UPDATE;
    case "delete":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.DELETE;
    case "statuschange":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.STATUS_CHANGE;
    case "cancel":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CANCEL;
    case "checkin":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.CHECK_IN;
    case "noshow":
      return UI_TEXT.AUDIT_LOG.ACTIONS_LIST.NO_SHOW;
    default:
      return action;
  }
}

export function getActionVariant(action: string): VariantProps<typeof badgeVariants>["variant"] {
  switch (action.toLowerCase()) {
    case "create":
    case "checkin":
      return "success";
    case "cancel":
    case "delete":
      return "destructive";
    case "statuschange":
    case "update":
      return "secondary";
    case "noshow":
      return "warning";
    default:
      return "outline";
  }
}

export function getReservationSubject(state: ParsedState, fallbackId: string) {
  const name = typeof state.CustomerName === "string" ? state.CustomerName : null;
  const phone = typeof state.CustomerPhone === "string" ? state.CustomerPhone : null;

  if (name && phone)
    return UI_TEXT.AUDIT_LOG.SUBJECTS.RESERVATION.replace("{name}", name).replace("{phone}", phone);
  if (name) return UI_TEXT.AUDIT_LOG.SUBJECTS.RESERVATION_NAME.replace("{name}", name);
  return UI_TEXT.AUDIT_LOG.SUBJECTS.RESERVATION_ID.replace("{id}", fallbackId.slice(0, 8));
}

export function getTableSubject(state: ParsedState, fallbackId: string) {
  const tableNumberValue =
    typeof state.TableNumber === "string" || typeof state.TableNumber === "number"
      ? String(state.TableNumber)
      : getStringField(state, ["tableNumber"]);

  if (tableNumberValue) {
    const formattedTableNumber = formatTableSubjectValue(tableNumberValue);
    if (formattedTableNumber) {
      return UI_TEXT.AUDIT_LOG.SUBJECTS.TABLE_NUM.replace("{number}", formattedTableNumber);
    }
  }

  const tableCode = getStringField(state, ["TableCode", "tableCode"]);
  if (tableCode) return `bàn ${tableCode}`;

  const cleaned = fallbackId.replace(/[{}"']/g, "").trim();
  const formattedFallback = formatTableSubjectValue(cleaned) || "0000";

  return UI_TEXT.AUDIT_LOG.SUBJECTS.TABLE_ID.replace("{id}", formattedFallback);
}

export function getPrimaryState(log: SystemAuditLog) {
  const oldState = parseJson(log.oldValues);
  const newState = parseJson(log.newValues);
  return Object.keys(newState).length > 0 ? newState : oldState;
}

export function getSummary(log: SystemAuditLog) {
  const primaryState = getPrimaryState(log);
  const actor = getActorLabel(log.actorInfo);
  const subject =
    log.entityName === "Reservation"
      ? getReservationSubject(primaryState, log.entityId)
      : log.entityName === "Table"
        ? getTableSubject(primaryState, log.entityId)
        : getEntityLabel(log.entityName);

  const action = log.action.toLowerCase();

  if (log.entityName === "Reservation") {
    if (action === "checkin") {
      return UI_TEXT.AUDIT_LOG.ACTION_RESULTS.CHECK_IN.replace("{actor}", actor).replace(
        "{subject}",
        subject
      );
    }
    if (action === "cancel") {
      return UI_TEXT.AUDIT_LOG.ACTION_RESULTS.CANCEL.replace("{actor}", actor).replace(
        "{subject}",
        subject
      );
    }
  }

  if (log.entityName === "Table" && action === "statuschange") {
    return UI_TEXT.AUDIT_LOG.ACTION_RESULTS.STATUS_CHANGE.replace("{actor}", actor).replace(
      "{subject}",
      subject
    );
  }

  return UI_TEXT.AUDIT_LOG.ACTION_RESULTS.GENERIC.replace("{actor}", actor)
    .replace("{action}", getActionLabel(log.action).toLowerCase())
    .replace("{subject}", subject);
}

export function getChangeItems(log: SystemAuditLog): ChangeItem[] {
  const oldState = parseJson(log.oldValues);
  const newState = parseJson(log.newValues);
  const keys = Array.from(new Set([...Object.keys(oldState), ...Object.keys(newState)]));

  const shouldHideKey = (key: string) => {
    const lower = key.toLowerCase();
    // Ẩn mã định danh nội bộ
    if (lower === "id" || lower === "orderid" || lower === "logid" || lower === "tableid") {
      return true;
    }
    // Ẩn thông tin kỹ thuật sâu
    if (
      lower.endsWith("id") ||
      lower.includes("token") ||
      lower.includes("revoked") ||
      lower.includes("expire")
    ) {
      return true;
    }
    return false;
  };

  return keys
    .filter((key) => !HIDDEN_CHANGE_KEYS.has(key) && !shouldHideKey(key))
    .map((key) => {
      const oldValue = oldState[key];
      const newValue = newState[key];

      return {
        key,
        label: (UI_TEXT.AUDIT_LOG.FIELDS as Record<string, string>)[key] ?? key,
        oldValue: formatScalarValue(oldValue, key),
        newValue: formatScalarValue(newValue, key),
      };
    })
    .filter((item) => item.oldValue !== item.newValue);
}

export function getStatusMessage() {
  return "";
}
