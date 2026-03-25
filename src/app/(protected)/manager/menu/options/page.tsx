import { OptionGroupMasterList } from "@/components/features/menu/options/OptionGroupMasterList";

export const metadata = {
  title: "Tùy chọn | FoodHub Manager",
  description: "Quản lý tùy chọn món ăn cho toàn hệ thống thực đơn.",
};

export default function MenuOptionsPage() {
  return (
    <div className="h-full w-full overflow-auto">
      <OptionGroupMasterList />
    </div>
  );
}
