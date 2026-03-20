import { ClipboardList, Image as ImageIcon, Plus, Utensils } from "lucide-react";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuForm } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";
import { Category } from "@/types/Menu";

import { RecipeSetupForm } from "../recipe/RecipeSetupForm";
import { MenuDetailsTab } from "./MenuDetailsTab";
import { MenuMediaTab } from "./MenuMediaTab";
import { MenuItemOptionAssignment } from "./options/MenuItemOptionAssignment";

interface MenuFormModalProps {
  categories: Category[];
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ categories }) => {
  const form = useMenuForm(categories);

  return (
    <Dialog open={form.isModalOpen} onOpenChange={form.handleClose}>
      <DialogContent
        className={`flex flex-col gap-0 p-0 border-none overflow-hidden rounded-xl bg-background shadow-2xl transition-all duration-300 ${form.activeTab === "recipe" ? "sm:max-w-7xl h-[90vh]" : "sm:max-w-2xl max-h-[90vh]"}`}
      >
        <div className="bg-card p-6 border-b shrink-0 z-30">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {form.isEditing
                    ? form.editingItem?.name || UI_TEXT.MENU.MODAL_EDIT_TITLE
                    : UI_TEXT.MENU.MODAL_ADD_TITLE}
                </DialogTitle>
                <DialogDescription className="text-foreground font-medium">
                  {form.isEditing ? UI_TEXT.MENU.MODAL_EDIT_DESC : UI_TEXT.MENU.MODAL_ADD_DESC}
                </DialogDescription>
              </div>
              {form.isEditing && (
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border">
                    {UI_TEXT.MENU.MODAL_ID_PREFIX} {form.itemId?.substring(0, 8)}
                    {UI_TEXT.COMMON.ELLIPSIS}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>

          <Tabs value={form.activeTab} onValueChange={form.setActiveTab} className="w-full">
            <TabsList className="bg-background p-1 rounded-lg border border-border">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-6 py-2 gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                {UI_TEXT.MENU.TAB_DETAILS}
              </TabsTrigger>
              {form.isEditing && !form.isSetMenuCategory && (
                <TabsTrigger
                  value="options"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {UI_TEXT.MENU.OPTIONS.TITLE}
                </TabsTrigger>
              )}
              {form.isEditing && !form.isSetMenuCategory && (
                <TabsTrigger
                  value="recipe"
                  className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-6 py-2 gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  {UI_TEXT.MENU.TAB_RECIPE}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-6 py-2 gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {UI_TEXT.MENU.TAB_MEDIA}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Tabs value={form.activeTab} onValueChange={form.setActiveTab} className="w-full">
            <TabsContent value="details" className="mt-0">
              <MenuDetailsTab form={form} categories={categories} />
            </TabsContent>

            <TabsContent value="options" className="mt-0 p-6">
              <MenuItemOptionAssignment
                assignments={form.optionAssignments}
                setAssignments={form.setOptionAssignments}
                menuItemId={form.itemId as string}
                isFetching={form.isFetchingAssignments}
              />
            </TabsContent>

            {form.isEditing && !form.isSetMenuCategory && (
              <TabsContent value="recipe" className="mt-0">
                <RecipeSetupForm
                  menuItemId={form.itemId as string}
                  onSuccess={() => {
                    form.fetchMenuItems();
                    form.setActiveTab("details");
                  }}
                  onCancel={form.handleClose}
                />
              </TabsContent>
            )}

            <TabsContent value="media" className="mt-0">
              <MenuMediaTab
                editingItem={form.editingItem}
                onFileChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    form.setSelectedImage(e.target.files[0]);
                  } else {
                    form.setSelectedImage(null);
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
