import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import FormAddStaff from "./FormAddStaff";

const AddStaff = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Staff</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-semibold mb-6">Add Staff Form</DialogTitle>
          <FormAddStaff />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaff;
