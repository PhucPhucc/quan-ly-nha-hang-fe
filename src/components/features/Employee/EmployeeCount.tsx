import TitleCount from "@/components/shared/TitleCount";
import { UI_TEXT } from "@/lib/UI_Text";
import { useEmployeeStore } from "@/store/useEmployeeStore";

const EmployeeCount = () => {
  const count = useEmployeeStore((state) => state.employees.length);

  return <TitleCount text={UI_TEXT.EMPLOYEE.TITLE} count={count}></TitleCount>;
};
export default EmployeeCount;
