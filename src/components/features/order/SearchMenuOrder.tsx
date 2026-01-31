import { SearchIcon } from "lucide-react";
import React from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const SearchMenuOrder = () => {
  return (
    <InputGroup className="w-md">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchMenuOrder;
