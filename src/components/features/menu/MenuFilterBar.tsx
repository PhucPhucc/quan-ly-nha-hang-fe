import { Plus, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { useMenuStore } from "@/store/useMenuStore";

interface MenuFilterBarProps {
  categories: { id: string; name: string }[];
}

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({ categories }) => {
  const { searchQuery, setSearchQuery, categoryId, setCategoryId, setEditingItem, setModalOpen } =
    useMenuStore();

  const handleAddNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-input" />
        </div>
        <Input
          type="text"
          placeholder={UI_TEXT.MENU.PLACEHOLDER_SEARCH}
          className="pl-10 w-full bg-gray-50 border focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="w-full md:w-64">
        <Select value={categoryId || "all"} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full bg-gray-50 border focus:ring-primary">
            <SelectValue placeholder={UI_TEXT.MENU.FILTER_ALL_CATEGORY} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{UI_TEXT.MENU.FILTER_ALL_CATEGORY}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={handleAddNew}
        className="shadow-lg hover:shadow-primary/20 transition-all font-semibold"
        size="lg"
      >
        <Plus className=" h-5 w-5" /> {UI_TEXT.MENU.ADD_NEW_ITEM}
      </Button>
    </div>
  );
};
