const TitleCount = ({ text, count }: { text: string; count: number }) => {
  return (
    <p className="text-md font-semibold md:text-2xl">
      {text} ({count})
    </p>
  );
};

export default TitleCount;
