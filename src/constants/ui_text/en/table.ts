export const TABLE = {
  TITLE: "Table Layout",
  SERVING: "In use",
  READY: "Available",
  RESERVED: "Reserved",
  EMPTY: "No tables yet",
  CANCELLED: "Cancelled",
  OUT_OF_SERVICE: "Out of service",
  COMPLETED: "Completed",
  FETCH_ERROR: "Could not load table list",
  RESERVATION_BTN: "Reserve",
  PEOPLE: "Guests",
  SELECTED_AREA_PLEASE: "Please select an area",
  NO_TABLES_FOUND: "No tables found.",
  CAPACITY_LIMIT: "Invalid seat count.",
  TABLE_NUMBER(num: number) {
    return `Table ${num}`;
  },

  TABLES: "tables",
  SEATS: "seats",
  AVAILABLE_COUNT: "active",
  INACTIVE_COUNT: "out of service",

  STATUS_AVAILABLE: "Available",
  STATUS_RESERVED: "Reserved",
  STATUS_OCCUPIED: "Occupied",
  STATUS_OUT_OF_SERVICE: "Out of service",
  STATUS_ACTIVE: "Active",
  STATUS_INACTIVE: "Out of service",

  EDIT_MODE: "Edit mode",
  ADD_TABLE: "Add table",
  VIP_SINGLE_TABLE_NOTICE: "VIP rooms can only have 1 table.",
  SEAT_COUNT: "Seat count",
  DEFAULT_SHAPE_NOTE: "* Default rectangular table",
  SEARCH_PLACEHOLDER: "Search table...",

  ACTIVATE: "Activate",
  DEACTIVATE: "Deactivate",
  SAVE_CHANGES: "Save changes",
  CREATE_ORDER: "Create Order",

  TABLE_CODE: "Table code",
  SEAT_COUNT_LABEL: "Seat count",
  EDIT_TABLE(code: string) {
    return `Edit table ${code}`;
  },
  TABLE_LABEL(code: string) {
    return `Table ${code}`;
  },
  RECT_SHAPE: "Rectangular",
  SEAT_SUFFIX: "seats",

  UPDATE_SUCCESS: "Updated successfully",
  ACTIVATE_SUCCESS: "Table activated",
  DEACTIVATE_SUCCESS: "Table deactivated",
  OPERATION_FAILED: "Operation failed",
  ADD_TABLE_SUCCESS: "Table added successfully",
  ADD_TABLE_ERROR: "Could not add table",
  UPDATE_ERROR: "Could not update",

  MANAGE_AREAS: "Manage areas",
  ADD_AREA: "Add new area",
  AREA_UPDATE: "Update area",
  AREA_NAME: "Area name",
  AREA_CODE: "Area code (Prefix)",
  AREA_TYPE: "Area type",
  AREA_DESCRIPTION: "Description",
  AREA_NAME_PLACEHOLDER: "e.g. Main Hall",
  AREA_CODE_PLACEHOLDER: "e.g. A",
  AREA_DESC_PLACEHOLDER: "Short description of the area...",
  AREA_DESCRIPTION_EMPTY: "No description",
  AREA_CODE_UNIQUE: "Code will be used as prefix for table codes (must be unique)",
  SEARCH_AREA_PLACEHOLDER: "Search area...",

  COL_CODE: "Area code",
  COL_NAME: "Area name",
  COL_TYPE: "Type",
  COL_TABLE_COUNT: "Table count",
  COL_STATUS: "Status",
  COL_ACTION: "Actions",

  TYPE_NORMAL: "Regular",
  TYPE_VIP: "VIP",

  FETCH_AREA_ERROR: "Could not load area list",
  FETCH_TABLE_ERROR: "Could not load table list",

  OVERVIEW: {
    TITLE: "Table Layout Overview",
    DESCRIPTION: "Manage and monitor real-time table status",
    TOTAL_TABLES: "Total tables",
    TOTAL_AREAS: "Total areas",
    TOTAL_SEATS: "Total seats",
    OCCUPANCY_RATE: "Occupancy rate",
    STATUS_SUMMARY: "Status summary",
    AREA_DISTRIBUTION: "Distribution by area",
    REFRESH: "Refresh",
    GO_TO_LAYOUT: "View detailed layout",
    AREA_STAT(count: number) {
      return `${count} tables`;
    },
    AUDIT: {
      TITLE: "Recent Activity",
      EMPTY: "No activity yet",
      LOADING: "Loading activity...",
      ACTOR_EMPLOYEE: "Employee",
      ACTOR_GUEST: "Guest",
      ACTOR_SYSTEM: "System",
      ACTION_CREATE: "Create",
      ACTION_UPDATE: "Update",
      ACTION_DELETE: "Delete",
      ACTION_STATUSCHANGE: "Status change",
      LOG_SUMMARY(actor: string, action: string, entity: string) {
        return `${actor} ${action} table ${entity}.`;
      },
      LOG_SUMMARY_GENERIC(action: string, entity: string) {
        return `Action ${action} on table ${entity}.`;
      },
    },
  },
};
