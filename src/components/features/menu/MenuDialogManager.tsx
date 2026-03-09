"use client";

import CreateMenuItemDialog from "@/components/features/menu/CreateMenuItemDialog";
import CreateSetMenuDialog from "@/components/features/menu/CreateSetMenuDialog";
import UpdateMenuItemDialog from "@/components/features/menu/UpdateMenuItemDialog";
import UpdateSetMenuDialog from "@/components/features/menu/UpdateSetMenuDialog";
// Import chính xác các Type từ hệ thống của bạn
import type {
  Category, // Hãy đảm bảo bạn có export type này ở @/types/Menu hoặc đâu đó tương tự
  MenuItem,
  MenuItemUpdateBody,
  SetMenu,
  SetMenuCreateBody,
  SetMenuUpdateBody,
} from "@/types/Menu";

interface MenuDialogManagerProps {
  dialogStates: {
    isCreateItemOpen: boolean;
    setIsCreateItemOpen: (open: boolean) => void;
    isUpdateItemOpen: boolean;
    setIsUpdateItemOpen: (open: boolean) => void;
    isCreateSetOpen: boolean;
    setIsCreateSetOpen: (open: boolean) => void;
    isUpdateSetOpen: boolean;
    setIsUpdateSetOpen: (open: boolean) => void;
  };
  editData: {
    editItem: MenuItem | null;
    setEditItem: (item: MenuItem | null) => void;
    editSet: SetMenu | null;
    setEditSet: (set: SetMenu | null) => void;
  };
  handlers: {
    handleCreateMenuItem: (formData: FormData) => Promise<void>;
    handleUpdateMenuItem: (payload: MenuItemUpdateBody) => Promise<void>;
    handleCreateSetMenu: (payload: SetMenuCreateBody) => Promise<void>;
    handleUpdateSetMenu: (payload: SetMenuUpdateBody) => Promise<void>;
  };
  categories: Category[]; // Sử dụng Type thống nhất ở đây
  allSingleItems: MenuItem[];
}

export default function MenuDialogManager({
  dialogStates,
  editData,
  handlers,
  categories,
  allSingleItems,
}: MenuDialogManagerProps) {
  return (
    <>
      <CreateMenuItemDialog
        open={dialogStates.isCreateItemOpen}
        onOpenChange={dialogStates.setIsCreateItemOpen}
        categories={categories}
        onSubmit={handlers.handleCreateMenuItem}
      />

      <UpdateMenuItemDialog
        open={dialogStates.isUpdateItemOpen}
        onOpenChange={(open) => {
          dialogStates.setIsUpdateItemOpen(open);
          if (!open) editData.setEditItem(null);
        }}
        initialData={editData.editItem}
        categories={categories}
        onSubmit={handlers.handleUpdateMenuItem}
      />

      <CreateSetMenuDialog
        open={dialogStates.isCreateSetOpen}
        onOpenChange={dialogStates.setIsCreateSetOpen}
        allMenuItems={allSingleItems}
        categories={categories}
        onSubmit={handlers.handleCreateSetMenu}
      />

      <UpdateSetMenuDialog
        open={dialogStates.isUpdateSetOpen}
        onOpenChange={(open) => {
          dialogStates.setIsUpdateSetOpen(open);
          if (!open) editData.setEditSet(null);
        }}
        initialData={editData.editSet}
        allMenuItems={allSingleItems}
        categories={categories}
        onSubmit={handlers.handleUpdateSetMenu}
      />
    </>
  );
}
