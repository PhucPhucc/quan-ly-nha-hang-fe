import TableCount from "@/components/features/table/TableCount";
import TablesList from "@/components/features/table/TablesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
const page = () => {
  return (
    <div>
      <div className="mb-4">
        <TableCount />
      </div>
      <div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{UI_TEXT.COMMON.ALL}</TabsTrigger>
            <TabsTrigger value="inprocess">{UI_TEXT.TABLE.INPROCESS}</TabsTrigger>
            <TabsTrigger value="ready">{UI_TEXT.TABLE.READY}</TabsTrigger>
            <TabsTrigger value="cleaning">{UI_TEXT.TABLE.CLEANING}</TabsTrigger>
          </TabsList>
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
