import TableCount from "@/components/features/table/TableCount";
import TableFilter from "@/components/features/table/TableFilter";
import TableLabel from "@/components/features/table/TableLabel";
import TableReserved from "@/components/features/table/TableReserved";
import TablesList from "@/components/features/table/TablesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
const page = () => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <TableCount />
        <div className="flex gap-2">
          <TableFilter />
          <TableReserved />
        </div>
      </div>
      <div>
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="all">{UI_TEXT.COMMON.ALL}</TabsTrigger>
              <TabsTrigger value="inprocess">{UI_TEXT.TABLE.INPROCESS}</TabsTrigger>
              <TabsTrigger value="ready">{UI_TEXT.TABLE.READY}</TabsTrigger>
              <TabsTrigger value="cleaning">{UI_TEXT.TABLE.CLEANING}</TabsTrigger>
            </TabsList>

            <TableLabel />
          </div>
          <TabsContent value="all">
            <TablesList />
          </TabsContent>
          <TabsContent value="inprocess">
            <p>inprocess</p>
          </TabsContent>
          <TabsContent value="ready">
            <p>ready</p>
          </TabsContent>
          <TabsContent value="cleaning">
            <p>cleaning</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
