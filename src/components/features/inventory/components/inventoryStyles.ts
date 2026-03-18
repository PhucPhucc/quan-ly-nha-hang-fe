export const INVENTORY_SURFACE_CLASS =
  "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/60";

export const INVENTORY_TOOLBAR_CLASS =
  "rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-100/60";

export const INVENTORY_TABLE_SURFACE_CLASS = `${INVENTORY_SURFACE_CLASS} overflow-hidden`;

export const INVENTORY_FIELD_WRAP_CLASS = "flex min-w-0 items-center gap-2";

export const INVENTORY_FIELD_LABEL_CLASS = "shrink-0 text-xs font-medium text-slate-500";

export const INVENTORY_INPUT_CLASS =
  "h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15";

export const INVENTORY_SELECT_TRIGGER_CLASS =
  "h-10 rounded-xl border-slate-200 bg-slate-50 text-sm shadow-none transition-colors focus:ring-2 focus:ring-primary/15";

export const INVENTORY_ICON_BUTTON_CLASS =
  "h-10 w-10 shrink-0 rounded-xl border-slate-200 p-0 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700";

export const INVENTORY_PAGINATION_BUTTON_CLASS =
  "h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-600 shadow-sm transition-colors hover:bg-slate-50";

export const INVENTORY_DATE_BUTTON_CLASS =
  "h-10 justify-start rounded-xl border-slate-200 bg-slate-50 text-left font-normal text-slate-900 shadow-none transition-colors hover:bg-slate-100/70";

export const INVENTORY_PAGE_CLASS = "flex h-full min-h-0 flex-col gap-4 bg-slate-50/30 p-4 pt-6";

// Table head cell — dùng chung cho tất cả list/detail table
export const INVENTORY_TH_CLASS =
  "py-3 font-semibold text-muted-foreground uppercase text-[11px] tracking-wider bg-muted/40";

// Table header row — sticky header trong list table
export const INVENTORY_THEAD_ROW_CLASS = "border-b border-border bg-muted/40 hover:bg-muted/40";

// Table body row — hover nhẹ, không gây flash
export const INVENTORY_TROW_CLASS = "h-[52px] border-border/60 hover:bg-muted/20 transition-colors";

// Detail card surface — dùng trong StockInDetailView / StockOutDetailView
export const INVENTORY_DETAIL_CARD_CLASS = "rounded-3xl border-border/60 shadow-sm overflow-hidden";

// Detail card header — bg nhẹ, border-b
export const INVENTORY_DETAIL_CARD_HEADER_CLASS = "bg-muted/30 border-b border-border/60 px-6 py-4";

// Creator avatar — initials circle
export const INVENTORY_AVATAR_CLASS =
  "h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50";

// Note block — italic quote container
export const INVENTORY_NOTE_BLOCK_CLASS = "bg-muted/40 rounded-xl p-3 border border-border/50";

// Loading placeholder text
export const INVENTORY_LOADING_CLASS =
  "flex h-full items-center justify-center text-muted-foreground font-medium";

// Empty state text
export const INVENTORY_EMPTY_CELL_CLASS = "h-32 text-center text-muted-foreground";
