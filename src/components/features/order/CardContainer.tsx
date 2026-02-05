import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardContainer = ({
  children,
  header,
  className,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent className="flex-1 min-h-0 p-0 flex flex-col">{children}</CardContent>
    </Card>
  );
};

export default CardContainer;
