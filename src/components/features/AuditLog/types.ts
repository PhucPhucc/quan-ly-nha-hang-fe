export interface AuditLogFilterState {
  actionFilter: string;
  entityNameFilter: string;
  fromDate?: Date;
  toDate?: Date;
}
