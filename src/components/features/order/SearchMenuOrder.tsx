import { SearchIcon } from "lucide-react";
import React from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const SearchMenuOrder = () => {
  return (
    <InputGroup className="ml-2 w-full max-w-xs">
      <InputGroupInput placeholder="Tim mon..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchMenuOrder;
