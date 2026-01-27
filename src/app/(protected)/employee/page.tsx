import EmployeeDialog from "@/components/features/staff/EmployeeDialog";
import EmployeeTable from "@/components/features/staff/EmployeeTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/types/Employee";

const page = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Staff (3)</p>
        <div className='flex gap-2'>
          <EmployeeDialog />
          <Select>
            <SelectTrigger className='w-28'>
              <SelectValue placeholder='Sort By' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='light'>Name</SelectItem>
              <SelectItem value='dark'>Manager</SelectItem>
              <SelectItem value='cashier'>Cashier</SelectItem>
              <SelectItem value='waiter'>Waiter</SelectItem>
              <SelectItem value='chef'>Chef</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-12'>
        <EmployeeTable  />
      </div>
    </div>
  );
};

export default page;

