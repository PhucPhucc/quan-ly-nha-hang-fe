import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Image as ImageIcon,
  Plus,
  Utensils,
} from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const getBadgeIcon = (variant: "outline" | "secondary" | "success" | "warning") => {
  if (variant === "success") {
    return <CheckCircle2 className="h-3 w-3" />;
  }

  if (variant === "warning") {
    return <AlertCircle className="h-3 w-3" />;
  }

  return null;
};

const TabLabel = ({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: { label: string; variant: "outline" | "secondary" | "success" | "warning" };
}) => (
  <>
    {icon}
    <span>{label}</span>
    {badge && (
      <Badge variant={badge.variant} className="ml-1 hidden md:inline-flex">
        {getBadgeIcon(badge.variant)}
        {badge.label}
      </Badge>
    )}
  </>
);

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ categories }) => {
  const form = useMenuForm(categories);
  const formId = "menu-form-modal";
  const showMainFooter = form.activeTab !== "recipe";

  return (
    <Dialog
      open={form.isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.handleClose();
        }
      }}
    >
      <DialogContent
        className={`flex flex-col gap-0 p-0 border-none overflow-hidden rounded-xl bg-background shadow-2xl transition-all duration-500 ease-in-out ${form.activeTab === "recipe" ? "sm:max-w-7xl h-212 max-h-[95vh]" : "sm:max-w-5xl h-212 max-h-[95vh]"}`}
      >
        <Tabs
          value={form.activeTab}
          onValueChange={form.setActiveTab}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="bg-card p-5 border-b shrink-0 z-30">
            <DialogHeader className="mb-4">
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

            <TabsList className="bg-background p-1 rounded-lg border border-border ">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-4 py-2 gap-2"
              >
                <TabLabel
                  icon={<ClipboardList className="w-4 h-4" />}
                  label={UI_TEXT.MENU.TAB_DETAILS}
                  badge={form.detailsStatus}
                />
              </TabsTrigger>

              {form.isEditing && !form.isSetMenuCategory && (
                <TabsTrigger
                  value="options"
                  className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-4 py-2 gap-2"
                >
                  <TabLabel
                    icon={<Plus className="w-4 h-4" />}
                    label={UI_TEXT.MENU.OPTIONS.TITLE}
                    badge={form.optionsStatus}
                  />
                </TabsTrigger>
              )}

              {form.isEditing && !form.isSetMenuCategory && (
                <TabsTrigger
                  value="recipe"
                  className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-4 py-2 gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  {UI_TEXT.MENU.TAB_RECIPE}
                </TabsTrigger>
              )}

              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-card-foreground/10 data-[state=active]:shadow-sm px-4 py-2 gap-2"
              >
                <TabLabel
                  icon={<ImageIcon className="w-4 h-4" />}
                  label={UI_TEXT.MENU.TAB_MEDIA}
                  badge={form.mediaStatus}
                />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
            <form id={formId} onSubmit={form.submitForm}>
              <TabsContent value="details" forceMount className="mt-0 data-[state=inactive]:hidden">
                <MenuDetailsTab form={form} categories={categories} />
              </TabsContent>
              <TabsContent value="media" forceMount className="mt-0 data-[state=inactive]:hidden">
                <MenuMediaTab form={form} />
              </TabsContent>
            </form>

            {form.isEditing && !form.isSetMenuCategory && (
              <TabsContent
                value="options"
                forceMount
                className="mt-0 p-4 pt-4 data-[state=inactive]:hidden"
              >
                <MenuItemOptionAssignment
                  assignments={form.optionAssignments}
                  setAssignments={form.setOptionAssignments}
                  menuItemId={form.itemId as string}
                  isFetching={form.isFetchingAssignments}
                />
              </TabsContent>
            )}

            {form.isEditing && !form.isSetMenuCategory && (
              <TabsContent value="recipe" forceMount className="mt-0 data-[state=inactive]:hidden">
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
          </div>
        </Tabs>

        {showMainFooter && (
          <div className="sticky bottom-0 bg-card border-t border-border p-4 px-8 flex justify-end gap-3 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <Button
              type="button"
              variant="outline"
              onClick={form.handleClose}
              disabled={form.isUploading}
              className="py-4 px-6"
            >
              {UI_TEXT.MENU.BUTTON_CANCEL}
            </Button>
            <Button
              type="submit"
              form={formId}
              disabled={form.isUploading}
              className="py-4 px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-95"
            >
              {form.isUploading
                ? UI_TEXT.MENU.UPLOADING_IMAGE
                : form.isEditing
                  ? UI_TEXT.MENU.BUTTON_UPDATE
                  : UI_TEXT.MENU.BUTTON_CREATE}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
