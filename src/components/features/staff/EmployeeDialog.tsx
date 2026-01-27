import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";

const EmployeeDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Staff</Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-semibold mb-6">Add Staff Form</DialogTitle>
        </DialogHeader>
          <EmployeeForm />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
