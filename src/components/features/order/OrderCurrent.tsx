"use client";

import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStore } from "@/store/useOrderStore";
const OrderCurrent = () => {
  const orderItems = useOrderStore((state) => state.items);
  const removeOrderItem = useOrderStore((state) => state.removeItem);
  const totalAmount = useOrderStore((state) => state.totalAmount);
  console.log(orderItems);
  return (
    <Card className="flex-1/3 justify-start gap-2">
      <CardHeader>
        <CardTitle className="text-2xl">Current order</CardTitle>
      </CardHeader>
      <CardContent>
        {orderItems.map((item) => (
          <div key={item.order_item_id} className="bg-secondary mb-2 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{item.item_name_snapshot}</p>
              <span
                className="hover:bg-primary-hover p-1 rounded-md hover:text-primary-foreground cursor-pointer transition duration-200"
                onClick={() => removeOrderItem(item.order_item_id)}
              >
                <X className="size-4" />
              </span>
            </div>

            <div className="mt-4 flex gap-4 items-center">
              <Button variant={"outline"} size={"icon-sm"} className="hover:bg-foreground/20">
                <Minus className="size-4" />
              </Button>
              <span>{item.quantity}</span>
              <Button variant={"outline"} size={"icon-sm"} className="hover:bg-foreground/20">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      {orderItems.length !== 0 && (
        <CardFooter className="flex flex-col">
          <div className="flex w-full justify-between text-xl font-bold border-t border-border py-2">
            <p>Subtotal: </p>
            <p>{totalAmount}VND</p>
          </div>
          <Button className="w-full mt-2">Submit Order</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCurrent;
