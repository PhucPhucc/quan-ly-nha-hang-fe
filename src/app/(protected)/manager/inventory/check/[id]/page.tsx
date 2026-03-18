"use client";

import React from "react";
import { use } from "react";

import { InventoryCheckForm } from "@/components/features/inventory/InventoryCheckForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InventoryCheckDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-6 lg:p-8 pt-4">
      <InventoryCheckForm id={id} />
    </div>
  );
}
