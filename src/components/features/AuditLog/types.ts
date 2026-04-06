export interface AuditLogFilterState {
  actionFilter: string;
  entityNameFilter: string;
  entityIdFilter: string;
  fromDate?: Date;
  toDate?: Date;
}
