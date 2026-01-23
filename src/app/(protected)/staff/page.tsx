import StaffTable from "@/components/feutures/staff-table/StaffTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

const page = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Staff (3)</p>
        <div className='flex gap-2'>
          <Button>Add Staff</Button>
          <Select>
            <SelectTrigger className='w-24'>
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
      <div className="mt-12">
        <StaffTable />
      </div>
    </div>
  );
};

export default page;
