"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image"; // Keep Image import as it's still used

// Added
import { Button } from "@/components/ui/button";
// Added
import { UI_TEXT } from "@/lib/UI_Text";

export function BlogSection() {
  const blogs = [
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Sj8M56b_ZV7gRmV3GbBw6atD7B5klFOy8Kggy3y-BObZPputtQvRhLOFDdENE2dBRxjTr6K7lolR8gyPoCDsJuqlHVOOO3nk8_N8PiNAwtafdb7SKcQ6ifaGqPqrqrCDIkYGD5fVec8J-zPGtfm9xqCPcfJ732iw2kg4omyYckxmPZSTp0X2g8RXenepBV3EphJj-6OaNA-g4dPyKLu6qOQC8eIImwdymYzwg_VLqWxhw3JLQrP1fF4nIJxcTdW4W2s5RCAW1_CX",
      title: "Câu chuyện của chúng tôi",
      date: "Jan 12, 2026",
      href: "/news/our-story",
    },
    {
      img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600",
      title: "Kế hoạch mở rộng FoodHub sang thị trường SEA",
      date: "Feb 03, 2026",
      href: "/news/expansion",
    },
    {
      img: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=600",
      title: "Bí quyết quản lý nhân sự hiệu quả trong giờ cao điểm",
      date: "Mar 15, 2026",
      href: "/news/hr",
    },
  ];

  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
              {UI_TEXT.LANDING.NEWS}
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">{UI_TEXT.LANDING.BLOG_TITLE}</h2>
          </div>
          <Button className="flex items-center gap-2 text-primary-foreground font-bold group transition-colors duration-300">
            {UI_TEXT.LANDING.READ_MORE}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {blogs.map((blog) => (
            <a
              href={blog.href || "#"}
              key={blog.title}
              className="group cursor-pointer flex flex-col h-full block"
            >
              <div className="overflow-hidden rounded-2xl mb-6 aspect-4/3 relative">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-3">
                <span className="bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                  {blog.date}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {UI_TEXT.LANDING.BLOG_INSIGHT}
                </span>
              </div>
              <h3 className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {blog.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
