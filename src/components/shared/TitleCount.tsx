import { UI_TEXT } from "@/lib/UI_Text";

const TitleCount = ({ text, count }: { text: string; count: number }) => {
  return (
    <p className="text-md font-semibold md:text-2xl">
      {text} {UI_TEXT.COMMON.PAREN_LEFT}
      {count}
      {UI_TEXT.COMMON.PAREN_RIGHT}
    </p>
  );
};

export default TitleCount;
