const TitleCount = ({ text, path }: { text: string; path?: string }) => {
  return <p className="text-md font-semibold md:text-2xl">{text} (3)</p>;
};

export default TitleCount;
