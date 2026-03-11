import { UI_TEXT } from "@/lib/UI_Text";
import { useEmployeeStore } from "@/store/useEmployeeStore";

const EmployeeCount = () => {
  const count = useEmployeeStore((state) => state.employees.length);

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-bold tracking-tight">{UI_TEXT.EMPLOYEE.TITLE}</h2>
      <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
        {count}
      </span>
    </div>
  );
};
export default EmployeeCount;
