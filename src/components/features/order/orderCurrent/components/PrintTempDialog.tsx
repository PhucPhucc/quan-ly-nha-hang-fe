import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UI_TEXT } from "@/lib/UI_Text";

const PrintTempDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {UI_TEXT.ORDER.CURRENT.PRINT_TEMP}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>
      </DialogContent>
    </Dialog>
  );
};

export default PrintTempDialog;
