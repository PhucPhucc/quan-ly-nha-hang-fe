import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CardContainer = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <Card className="h-full">
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardContainer;
