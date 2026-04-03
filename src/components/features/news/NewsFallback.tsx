"use clients";
/* eslint-disable react/jsx-no-literals */
import { Footer } from "@/components/features/Landing/components/Footer";
import { Navbar } from "@/components/features/Landing/components/Navbar";

type NewsFallbackProps = {
  newsid: string;
};

export function NewsFallback({ newsid }: NewsFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center pt-20">
        <h1 className="mb-4 text-3xl font-bold">Nội dung đang được cập nhật</h1>
        <p className="text-muted-foreground">
          Bạn đang xem trang tin tức/landing có ID:{" "}
          <span className="font-mono text-primary">{newsid}</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
