import EmployeeContainerTable from "@/components/features/staff/EmployeeContainerTable";
import EmployeeCount from "@/components/features/staff/EmployeeCount";
import EmployeeDialog from "@/components/features/staff/EmployeeDialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

const page = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <EmployeeCount />
        <div className='flex gap-2'>
          <EmployeeDialog />
          <Select>
            <SelectTrigger className='w-28'>
              <SelectValue placeholder='Lọc' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='manager'>{UI_TEXT.ROLE.MANAGER}</SelectItem>
              <SelectItem value='cashier'>{UI_TEXT.ROLE.CASHIER}</SelectItem>
              <SelectItem value='waiter'>{UI_TEXT.ROLE.WAITER}</SelectItem>
              <SelectItem value='chef'>{UI_TEXT.ROLE.CHEF}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-12'>
        <EmployeeContainerTable />
      </div>
    </div>
  );
};

export default page;
