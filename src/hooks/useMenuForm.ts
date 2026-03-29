import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FieldErrors, FieldPath, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UI_TEXT } from "@/lib/UI_Text";
import { cloudinaryService } from "@/services/cloudinaryService";
import { menuService } from "@/services/menuService";
import { optionService } from "@/services/optionService";
import { useMenuStore } from "@/store/useMenuStore";
import { CategoryType, Station } from "@/types/enums";
import { Category, MenuItem, MenuItemOptionGroup, SetMenu } from "@/types/Menu";

type SetMenuApiRes = SetMenu & {
  categoryId?: string;
  items?: { menuItemId: string; quantity: number }[];
};

const stringField = () => z.string().trim();

const requiredNumberStringField = (min: number) =>
  z
    .string()
    .trim()
    .min(1, UI_TEXT.FORM.REQUIRED)
    .refine((value) => !Number.isNaN(Number(value)), { message: UI_TEXT.FORM.REQUIRED })
    .refine((value) => Number(value) >= min, { message: UI_TEXT.FORM.MIN_VALUE(min) });

const requiredPositiveIntStringField = () =>
  z
    .string()
    .trim()
    .min(1, UI_TEXT.FORM.REQUIRED)
    .refine((value) => !Number.isNaN(Number(value)), { message: UI_TEXT.FORM.REQUIRED })
    .refine((value) => Number.isInteger(Number(value)), { message: UI_TEXT.FORM.INT_ONLY })
    .refine((value) => Number(value) >= 1, { message: UI_TEXT.FORM.MIN_VALUE(1) });

const createMenuFormSchema = (categories: Category[]) =>
  z
    .object({
      name: stringField().min(1, UI_TEXT.FORM.REQUIRED),
      description: stringField().max(50, UI_TEXT.FORM.MAX_VALUE(50)),
      price: requiredNumberStringField(0),
      cost: requiredNumberStringField(0),
      categoryId: stringField().min(1, UI_TEXT.FORM.REQUIRED),
      imageUrl: stringField(),
      station: stringField(),
      expectedTime: stringField(),
      comboItems: z.array(
        z.object({
          menuItemId: stringField(),
          quantity: requiredPositiveIntStringField(),
        })
      ),
    })
    .superRefine((values, ctx) => {
      const isSetMenuCategory =
        categories.find((category) => category.categoryId === values.categoryId)?.type ===
        CategoryType.SPECIAL_GROUP;

      if (isSetMenuCategory) {
        if (values.comboItems.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: UI_TEXT.FORM.REQUIRED,
            path: ["comboItems"],
          });
          return;
        }

        values.comboItems.forEach((item, index) => {
          if (!item.menuItemId) {
            ctx.addIssue({
              code: "custom",
              message: UI_TEXT.FORM.REQUIRED,
              path: ["comboItems", index, "menuItemId"],
            });
          }
        });

        return;
      }

      if (!values.station) {
        ctx.addIssue({
          code: "custom",
          message: UI_TEXT.FORM.REQUIRED,
          path: ["station"],
        });
      }

      if (!values.expectedTime) {
        ctx.addIssue({
          code: "custom",
          message: UI_TEXT.FORM.REQUIRED,
          path: ["expectedTime"],
        });
      } else if (Number.isNaN(Number(values.expectedTime))) {
        ctx.addIssue({
          code: "custom",
          message: UI_TEXT.FORM.REQUIRED,
          path: ["expectedTime"],
        });
      } else if (!Number.isInteger(Number(values.expectedTime))) {
        ctx.addIssue({
          code: "custom",
          message: UI_TEXT.FORM.INT_ONLY,
          path: ["expectedTime"],
        });
      } else if (Number(values.expectedTime) < 1) {
        ctx.addIssue({
          code: "custom",
          message: UI_TEXT.FORM.MIN_VALUE(1),
          path: ["expectedTime"],
        });
      }
    });

export type MenuFormValues = z.infer<ReturnType<typeof createMenuFormSchema>>;

const getFallbackCategoryId = (
  categories: Category[],
  isSetMenu: boolean,
  preferredCategoryId?: string
) => {
  if (
    preferredCategoryId &&
    categories.some((category) => category.categoryId === preferredCategoryId)
  ) {
    return preferredCategoryId;
  }

  return (
    categories.find(
      (category) => category.type === (isSetMenu ? CategoryType.SPECIAL_GROUP : CategoryType.NORMAL)
    )?.categoryId ||
    categories[0]?.categoryId ||
    ""
  );
};

const getInitialValues = (
  categories: Category[],
  editingItem: MenuItem | SetMenu | null,
  overrides?: Partial<MenuFormValues>
): MenuFormValues => {
  const isSetMenu = !!editingItem && "setMenuId" in editingItem;
  const editingCategoryId =
    editingItem && "categoryId" in editingItem ? editingItem.categoryId : undefined;
  const fallbackCategoryId = getFallbackCategoryId(
    categories,
    isSetMenu,
    overrides?.categoryId || editingCategoryId
  );

  return {
    name: overrides?.name ?? editingItem?.name ?? "",
    description: overrides?.description ?? editingItem?.description ?? "",
    price: overrides?.price ?? (editingItem ? String(editingItem.price) : ""),
    cost: overrides?.cost ?? (editingItem ? String(editingItem.costPrice) : ""),
    categoryId: fallbackCategoryId,
    imageUrl: overrides?.imageUrl ?? editingItem?.imageUrl ?? "",
    station:
      overrides?.station ??
      (editingItem && "station" in editingItem
        ? String(editingItem.station)
        : Station.HOT_KITCHEN.toString()),
    expectedTime:
      overrides?.expectedTime ??
      (editingItem && "expectedTime" in editingItem ? String(editingItem.expectedTime) : ""),
    comboItems: overrides?.comboItems ?? [],
  };
};

type TabStatus = {
  label: string;
  variant: "outline" | "secondary" | "success" | "warning";
};

const isFilled = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== undefined && value !== null && value !== "";
};

const countLeafErrors = (errors: FieldErrors<MenuFormValues>) => {
  let count = 0;

  const walk = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return;
    }

    if ("message" in (value as Record<string, unknown>)) {
      count += 1;
      return;
    }

    Object.values(value as Record<string, unknown>).forEach(walk);
  };

  walk(errors);

  return count;
};

const getFirstErrorPath = (
  errors: FieldErrors<MenuFormValues>,
  prefix = ""
): FieldPath<MenuFormValues> | undefined => {
  for (const [key, value] of Object.entries(errors)) {
    if (!value) {
      continue;
    }

    const nextPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && "message" in value && value.message) {
      return nextPath as FieldPath<MenuFormValues>;
    }

    if (typeof value === "object") {
      const childPath = getFirstErrorPath(value as FieldErrors<MenuFormValues>, nextPath);

      if (childPath) {
        return childPath;
      }
    }
  }

  return undefined;
};

const getTabForField = (fieldPath?: FieldPath<MenuFormValues>) => {
  if (!fieldPath) {
    return "details" as const;
  }

  if (fieldPath === "imageUrl") {
    return "media" as const;
  }

  return "details" as const;
};

export const useMenuForm = (categories: Category[]) => {
  const {
    isModalOpen,
    setModalOpen,
    editingItem,
    setEditingItem,
    addMenuItem,
    updateMenuItem,
    addSetMenu,
    updateSetMenu,
    menuItems,
    fetchMenuItems,
  } = useMenuStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [optionAssignments, setOptionAssignments] = useState<MenuItemOptionGroup[]>([]);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);
  const [isFetchingCombo, setIsFetchingCombo] = useState(false);

  const schema = useMemo(() => createMenuFormSchema(categories), [categories]);
  const defaultValues = useMemo(() => getInitialValues(categories, null), [categories]);
  const formMethods = useForm<MenuFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    shouldFocusError: false,
  });
  const { control, formState, getValues, handleSubmit, reset, setFocus, watch } = formMethods;
  const { append, fields, remove } = useFieldArray({
    control,
    name: "comboItems",
    keyName: "fieldId",
  });

  const isEditing = !!editingItem;
  const isSetMenu = isEditing && editingItem && "setMenuId" in editingItem;
  const itemId = editingItem
    ? isSetMenu
      ? (editingItem as SetMenu).setMenuId
      : (editingItem as MenuItem).menuItemId
    : null;
  const selectedCategoryId = watch("categoryId");
  const imageUrl = watch("imageUrl");
  const formValues = watch();
  const isSetMenuCategory =
    categories.find((category) => category.categoryId === selectedCategoryId)?.type ===
    CategoryType.SPECIAL_GROUP;

  useEffect(() => {
    if (isSetMenuCategory && (activeTab === "options" || activeTab === "recipe")) {
      setActiveTab("details");
    }
  }, [activeTab, isSetMenuCategory]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    setActiveTab("details");
    setSelectedImage(null);
    reset(getInitialValues(categories, editingItem));

    if (editingItem) {
      if (isSetMenu && itemId) {
        setIsFetchingCombo(true);
        menuService
          .getSetMenuById(itemId)
          .then((response) => {
            if (response.isSuccess && response.data) {
              const setMenuData = response.data as SetMenuApiRes;
              reset(
                getInitialValues(categories, editingItem, {
                  categoryId: setMenuData.categoryId,
                  imageUrl: setMenuData.imageUrl ?? editingItem.imageUrl,
                  comboItems:
                    setMenuData.items?.map((item) => ({
                      menuItemId: item.menuItemId,
                      quantity: String(item.quantity),
                    })) ?? [],
                })
              );
            }
          })
          .finally(() => setIsFetchingCombo(false));
      }

      if (!isSetMenu && itemId) {
        setIsFetchingAssignments(true);
        optionService
          .getAssignmentsByMenuItem(itemId)
          .then((response) => {
            if (response.isSuccess && response.data) {
              setOptionAssignments(response.data);
            }
          })
          .finally(() => setIsFetchingAssignments(false));
      } else {
        setOptionAssignments([]);
      }
    } else {
      setOptionAssignments([]);
    }
  }, [categories, editingItem, isModalOpen, isSetMenu, itemId, reset]);

  const resetModalState = () => {
    reset(getInitialValues(categories, null));
    setSelectedImage(null);
    setActiveTab("details");
    setOptionAssignments([]);
    setIsFetchingAssignments(false);
    setIsFetchingCombo(false);
  };

  const handleClose = () => {
    resetModalState();
    setModalOpen(false);
    setEditingItem(null);
  };

  const focusField = (fieldPath?: FieldPath<MenuFormValues>) => {
    if (!fieldPath) {
      return;
    }

    const targetTab = getTabForField(fieldPath);
    setActiveTab(targetTab);

    window.setTimeout(() => {
      const target =
        document.querySelector<HTMLElement>(`[data-field-path="${fieldPath}"]`) ||
        document.querySelector<HTMLElement>(`[name="${fieldPath}"]`) ||
        document.getElementById(fieldPath);

      if (target) {
        target.focus();
        return;
      }

      try {
        setFocus(fieldPath);
      } catch {}
    }, 50);
  };

  const handleInvalidSubmit = (errors: FieldErrors<MenuFormValues>) => {
    const firstErrorPath = getFirstErrorPath(errors);
    focusField(firstErrorPath);
    toast.error(UI_TEXT.COMMON.VALIDATION_ERROR);
  };

  const handleValidSubmit = async (data: MenuFormValues) => {
    let imageValue = data.imageUrl;

    if (selectedImage) {
      setIsUploading(true);

      try {
        const uploadResponse = await cloudinaryService.uploadImage(selectedImage, "menu-items");

        if (uploadResponse.isSuccess && uploadResponse.data?.imageUrl) {
          imageValue = uploadResponse.data.imageUrl;
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error(error instanceof Error ? error.message : "Image upload failed");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (isEditing && !itemId) {
      toast.error("Không tìm thấy ID món cần cập nhật");
      return;
    }

    try {
      if (isSetMenuCategory) {
        const setMenuData: Partial<SetMenu> & {
          categoryId: string;
          items: { menuItemId: string; quantity: number }[];
        } = {
          name: data.name.trim(),
          description: data.description.trim(),
          price: Number(data.price),
          costPrice: Number(data.cost),
          imageUrl: imageValue,
          categoryId: data.categoryId,
          items: data.comboItems
            .filter((item) => item.menuItemId && Number(item.quantity) > 0)
            .map((item) => ({
              menuItemId: item.menuItemId,
              quantity: Number(item.quantity),
            })),
        };

        if (isEditing && isSetMenu) {
          await updateSetMenu(itemId!, setMenuData);
        } else {
          await addSetMenu(setMenuData);
        }
      } else {
        const menuItemData: Partial<MenuItem> = {
          name: data.name.trim(),
          description: data.description.trim(),
          price: Number(data.price),
          costPrice: Number(data.cost),
          imageUrl: imageValue,
          categoryId: data.categoryId,
          expectedTime: Number(data.expectedTime),
          station: Number(data.station),
        };

        let savedMenuItemId = itemId;

        if (isEditing && !isSetMenu) {
          await updateMenuItem(itemId!, menuItemData);
        } else {
          const newItem = await addMenuItem(menuItemData);
          if (newItem) {
            savedMenuItemId = newItem.menuItemId;
          }
        }

        if (savedMenuItemId) {
          for (const assignment of optionAssignments) {
            if (assignment.menuItemOptionGroupId.startsWith("temp-")) {
              await optionService.assignToMenuItem({
                menuItemId: savedMenuItemId,
                optionGroupId: assignment.optionGroupId,
                isRequired: assignment.isRequired,
                minSelect: assignment.minSelect,
                maxSelect: assignment.maxSelect,
                sortOrder: assignment.sortOrder,
              });
            } else {
              await optionService.updateAssignment(assignment.menuItemOptionGroupId, {
                isRequired: assignment.isRequired,
                minSelect: assignment.minSelect,
                maxSelect: assignment.maxSelect,
                sortOrder: assignment.sortOrder,
              });
            }
          }
        }
      }

      toast.success(UI_TEXT.MENU.SAVE_SUCCESS);
      handleClose();
    } catch (error) {
      console.error("Failed to save menu item", error);
      toast.error(error instanceof Error ? error.message : "Failed to save menu item");
    }
  };

  const detailsMissingCount = useMemo(() => {
    let count = 0;

    if (!isFilled(formValues.name)) count += 1;
    if (!isFilled(formValues.price)) count += 1;
    if (!isFilled(formValues.cost)) count += 1;
    if (!isFilled(formValues.categoryId)) count += 1;

    if (isSetMenuCategory) {
      const validComboCount = formValues.comboItems.filter(
        (item) => item.menuItemId && Number(item.quantity) > 0
      ).length;

      if (validComboCount === 0) {
        count += 1;
      }
    } else {
      if (!isFilled(formValues.station)) count += 1;
      if (!isFilled(formValues.expectedTime)) count += 1;
    }

    return count;
  }, [
    formValues.categoryId,
    formValues.comboItems,
    formValues.cost,
    formValues.expectedTime,
    formValues.name,
    formValues.price,
    formValues.station,
    isSetMenuCategory,
  ]);

  const detailsErrorCount = useMemo(() => {
    const { categoryId, comboItems, cost, expectedTime, name, price, station } = formState.errors;

    return countLeafErrors({
      categoryId,
      comboItems,
      cost,
      expectedTime,
      name,
      price,
      station,
    });
  }, [formState.errors]);

  const detailsStatus: TabStatus =
    detailsErrorCount > 0
      ? { label: `${detailsErrorCount} lỗi`, variant: "warning" }
      : detailsMissingCount === 0
        ? { label: "Sẵn sàng", variant: "success" }
        : { label: `${detailsMissingCount} thiếu`, variant: "secondary" };

  const mediaStatus: TabStatus =
    selectedImage || imageUrl.trim()
      ? { label: "Có ảnh", variant: "success" }
      : { label: "Tùy chọn", variant: "outline" };

  const optionsStatus: TabStatus =
    optionAssignments.length > 0
      ? { label: `${optionAssignments.length} nhóm`, variant: "success" }
      : { label: "Chưa gán", variant: "outline" };

  const submitForm = handleSubmit(handleValidSubmit, handleInvalidSubmit);

  return {
    isModalOpen,
    isEditing,
    isSetMenu,
    itemId,
    isSetMenuCategory,
    editingItem,
    menuItems,
    fetchMenuItems,

    formMethods,
    control,
    formState,
    selectedCategoryId,
    selectedImage,
    setSelectedImage,
    isUploading,
    activeTab,
    setActiveTab,
    imageUrl,

    comboItemsFields: fields,
    appendComboItem: () => append({ menuItemId: "", quantity: "1" }),
    removeComboItem: remove,
    optionAssignments,
    setOptionAssignments,
    isFetchingAssignments,
    isFetchingCombo,

    detailsStatus,
    mediaStatus,
    optionsStatus,

    getValues,
    submitForm,
    handleClose,
    focusField,
  };
};

export type MenuFormType = ReturnType<typeof useMenuForm>;
