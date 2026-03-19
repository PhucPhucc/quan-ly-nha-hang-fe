"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { optionService } from "@/services/optionService";
import { OptionGroup } from "@/types/Menu";

import { OptionGroupFilters } from "./OptionGroupFilters";
import { OptionGroupFormModal } from "./OptionGroupFormModal";
import { OptionGroupTable } from "./OptionGroupTable";

export const OptionGroupMasterList: React.FC = () => {
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await optionService.getAllReusable(1, 100);
      if (res.isSuccess && res.data) setGroups(res.data.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((g) => {
    const matchName = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || String(g.optionType) === typeFilter;
    return matchName && matchType;
  });

  const handleCreate = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };
  const handleEdit = (g: OptionGroup) => {
    setEditingGroup(g);
    setModalOpen(true);
  };

  const handleDelete = async (group: OptionGroup) => {
    if (!confirm(UI_TEXT.MENU.OPTIONS.DELETE_CONFIRM(group.name))) return;
    try {
      const res = await optionService.deleteReusable(group.optionGroupId);
      if (res.isSuccess) {
        toast.success(UI_TEXT.MENU.OPTIONS.DELETE_SUCCESS);
        setGroups((prev) => prev.filter((g) => g.optionGroupId !== group.optionGroupId));
      } else {
        toast.error(UI_TEXT.MENU.OPTIONS.DELETE_IN_USE_ERROR);
      }
    } catch {
      toast.error(UI_TEXT.COMMON.ERROR_UNKNOWN);
    }
  };

  const handleModalSuccess = (saved: OptionGroup) => {
    setGroups((prev) => {
      const idx = prev.findIndex((g) => g.optionGroupId === saved.optionGroupId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <OptionGroupFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          onCreate={handleCreate}
        />
        <OptionGroupTable
          groups={filteredGroups}
          loading={loading}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </div>
      <OptionGroupFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingGroup={editingGroup}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};
