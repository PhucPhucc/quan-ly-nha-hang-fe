"use client";

import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import CardContainer from "../CardContainer";
const OrderCurrent = () => {
  return (
    <CardContainer
      header={
        <CardHeader>
          <CardTitle className="text-2xl">Current order</CardTitle>
        </CardHeader>
      }
    >
      <CardContent>
        <div className="bg-secondary mb-2 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <p className="font-semibold"></p>
            <span className="hover:bg-primary-hover p-1 rounded-md hover:text-primary-foreground cursor-pointer transition duration-200">
              <X className="size-4" />
            </span>
          </div>

          <div className="mt-4 flex gap-4 items-center">
            <Button variant={"outline"} size={"icon-sm"} className="hover:bg-foreground/20">
              <Minus className="size-4" />
            </Button>
            <span></span>
            <Button variant={"outline"} size={"icon-sm"} className="hover:bg-foreground/20">
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex w-full justify-between text-xl font-bold border-t border-border py-2">
          <p>Subtotal: </p>
          <p>VND</p>
        </div>
        <Button className="w-full mt-2">Submit Order</Button>
      </CardFooter>
    </CardContainer>
  );
};

export default OrderCurrent;
