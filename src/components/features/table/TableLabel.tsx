import { UI_TEXT } from "@/lib/UI_Text";

const label = [
  {
    id: 1,
    text: UI_TEXT.TABLE.READY,
    css: "bg-table-empty",
  },
  {
    id: 2,
    text: UI_TEXT.TABLE.RESERVED,
    css: "bg-table-reserved",
  },
  {
    id: 3,
    text: UI_TEXT.TABLE.CLEANING,
    css: "bg-table-cleaning",
  },
  {
    id: 4,
    text: UI_TEXT.TABLE.INPROCESS,
    css: "bg-table-inprocess",
  },
];

const TableLabel = () => {
  return (
    <div className="flex gap-2">
      {label.map((item) => (
        <div key={item.id}>
          <span className={`inline-block h-3 w-3 rounded-full mr-2 ${item.css}`}></span>
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default TableLabel;
