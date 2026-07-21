import dynamic from "next/dynamic";

export const PartnerContactSectionWrapper = dynamic(
  () => import("./PartnerContactSection").then((mod) => mod.PartnerContactSection),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-background scroll-mt-24 overflow-hidden" />,
  }
);
