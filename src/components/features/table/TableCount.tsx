import React from "react";

import TitleCount from "@/components/shared/TitleCount";
import { UI_TEXT } from "@/lib/UI_Text";

const TableCount = () => {
  // TODO: Add count store
  return <TitleCount text={UI_TEXT.TABLE.TITLE} count={0} />;
};

export default TableCount;
