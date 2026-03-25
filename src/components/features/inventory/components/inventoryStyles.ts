export const INVENTORY_SURFACE_CLASS =
  "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/60";

export const INVENTORY_TOOLBAR_CLASS =
  "rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-100/60";

export const INVENTORY_TABLE_SURFACE_CLASS = `${INVENTORY_SURFACE_CLASS} overflow-hidden`;

export const INVENTORY_FIELD_WRAP_CLASS = "flex min-w-0 items-center gap-2";

export const INVENTORY_FIELD_LABEL_CLASS = "shrink-0 text-xs font-medium text-slate-500";

export const INVENTORY_INPUT_CLASS =
  "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm shadow-none transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15";

export const INVENTORY_SELECT_TRIGGER_CLASS =
  "h-10 rounded-lg border-slate-200 bg-slate-50 text-sm shadow-none transition-colors focus:ring-2 focus:ring-primary/15";

export const INVENTORY_ICON_BUTTON_CLASS =
  "h-10 w-10 shrink-0 rounded-lg border-slate-200 p-0 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700";

export const INVENTORY_PAGINATION_BUTTON_CLASS =
  "h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-600 shadow-sm transition-colors hover:bg-slate-50";

export const INVENTORY_DATE_BUTTON_CLASS =
  "h-10 justify-start rounded-lg border-slate-200 bg-slate-50 text-left font-normal text-slate-900 shadow-none transition-colors hover:bg-slate-100/70";

export const INVENTORY_PAGE_CLASS =
  "flex flex-1 min-h-0 flex-col gap-4 bg-slate-50/30 p-4 pt-6 overflow-y-auto";

// Table behavior - container scroll + height (shorter to leave room for pagination)
export const INVENTORY_TABLE_CONTAINER_CLASS = "max-h-[540px] overflow-auto relative";

// Table header wrapper - sticky background
export const INVENTORY_THEAD_CLASS =
  "sticky top-0 z-20 border-b border-slate-200 bg-slate-50 shadow-sm";

// Table head row - background & hover logic
export const INVENTORY_THEAD_ROW_CLASS = "border-slate-200 bg-slate-50 hover:bg-slate-50";

// Table head cell - text style & padding
export const INVENTORY_TH_CLASS =
  "bg-slate-50 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-800";

// Table body row - hover effect
export const INVENTORY_TROW_CLASS = "h-[52px] border-border/60 hover:bg-muted/10 transition-colors";

// Detail card surface
export const INVENTORY_DETAIL_CARD_CLASS =
  "rounded-3xl border-border/60 shadow-sm overflow-hidden py-0 gap-0";

// Detail card header
export const INVENTORY_DETAIL_CARD_HEADER_CLASS =
  "bg-muted/30 border-b border-border/60 px-6 py-4 pb-4! [.border-b]:pb-4!";

// Creator avatar
export const INVENTORY_AVATAR_CLASS =
  "h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50";

// Note block
export const INVENTORY_NOTE_BLOCK_CLASS = "bg-muted/40 rounded-lg p-3 border border-border/50";

// Loading placeholder text
export const INVENTORY_LOADING_CLASS =
  "flex h-full items-center justify-center text-muted-foreground font-medium";

// Empty state text
export const INVENTORY_EMPTY_CELL_CLASS = "h-32 text-center text-muted-foreground";
