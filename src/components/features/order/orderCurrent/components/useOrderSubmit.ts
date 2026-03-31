import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { CartItem } from "@/types/Cart";
import { Order } from "@/types/Order";

interface SubmitToKitchenParams {
  selectedOrderId: string | null;
  orders: Order[];
  cartData: Record<string, CartItem[]>;
  clearCart: (orderId: string) => void;
  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  setActiveView: (view: "order" | "menu") => void;
  setIsSubmitting: (value: boolean) => void;
}

export const submitToKitchen = async ({
  selectedOrderId,
  orders,
  cartData,
  clearCart,
  fetchOrders,
  fetchOrderDetails,
  setActiveView,
  setIsSubmitting,
}: SubmitToKitchenParams): Promise<void> => {
  if (!selectedOrderId) {
    toast.error(UI_TEXT.ORDER.CURRENT.SELECT_TABLE_REQUIRED);
    return;
  }

  const activeOrder = orders.find((order) => order.orderId === selectedOrderId);
  if (!activeOrder) {
    toast.error(UI_TEXT.ORDER.CURRENT.ORDER_NOT_FOUND);
    return;
  }

  const items = cartData[selectedOrderId] || [];
  if (items.length === 0) {
    toast.error(UI_TEXT.ORDER.CURRENT.CART_EMPTY);
    return;
  }

  try {
    setIsSubmitting(true);

    const submitData = {
      orderId: selectedOrderId,
      tableId: activeOrder.tableId || null,
      orderType: activeOrder.orderType,
      note: activeOrder.note || "",
      items: items.map((item) => ({
        menuItemId: item.menuItem.menuItemId,
        setMenuId: item.menuItem.setMenuId,
        quantity: item.quantity,
        note: item.note,
        selectedOptions: item.selectedOptions.map((group) => ({
          optionGroupId: group.optionGroupId,
          selectedValues: group.selectedValues.map((value) => ({
            optionItemId: value.optionItemId,
            quantity: value.quantity,
            note: value.note,
          })),
        })),
        comboItems: item.comboChildren?.map((child) => ({
          menuItemId: child.menuItemId,
          quantity: child.quantity,
          note: child.note,
          selectedOptions: child.selectedOptions.map((group) => ({
            optionGroupId: group.optionGroupId,
            selectedValues: group.selectedValues.map((value) => ({
              optionItemId: value.optionItemId,
              quantity: value.quantity,
              note: value.note,
            })),
          })),
        })),
      })),
    };

    const submitRes = await orderService.submitToKitchen(submitData);
    if (submitRes.isSuccess) {
      toast.success(UI_TEXT.ORDER.CURRENT.SUBMIT_SUCCESS);
      clearCart(selectedOrderId);
      await fetchOrders();
      await fetchOrderDetails(selectedOrderId);
      setActiveView("order");
    } else {
      toast.error(`${UI_TEXT.ORDER.CURRENT.SUBMIT_FAILED}: ${submitRes.message}`);
    }
  } catch (error) {
    console.error("Order submission failed:", error);
    toast.error(UI_TEXT.ORDER.CURRENT.SUBMIT_ERROR);
  } finally {
    setIsSubmitting(false);
  }
};
