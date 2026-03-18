"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Wrapper ngoài cùng: border + rounded + shadow */
function TableShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-shell"
      className={cn(
        "overflow-hidden rounded-xl border border-table-border-strong bg-[var(--table-shell-bg)] shadow-sm",
        className
      )}
      {...props}
    />
  );
}

interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string;
}

function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
}

interface TableRowProps extends React.ComponentProps<"tr"> {
  variant?: "default" | "header";
}

function TableRow({ className, variant = "default", ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors",
        variant === "header"
          ? "border-table-border-strong bg-table-header-bg hover:bg-table-header-bg"
          : "border-table-border-soft hover:bg-table-row-hover data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-[3.4rem] px-6 py-[0.95rem] text-left align-middle text-[0.69rem] font-bold uppercase tracking-[0.14em] text-table-heading whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-2 align-middle text-table-text whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
};
