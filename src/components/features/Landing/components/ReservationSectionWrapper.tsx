import dynamic from "next/dynamic";

export const ReservationSectionWrapper = dynamic(
  () => import("./ReservationSection").then((mod) => mod.ReservationSection),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-background scroll-mt-24 overflow-hidden" />,
  }
);
