"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  ChefHat,
  ClipboardList,
  Flame,
  LayoutDashboard,
  MonitorPlay,
  Quote,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";

export default function LandingPage() {
  const { employee } = useAuthStore();
  const t = UI_TEXT.LANDING;

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Utensils className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">FoodHub</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t.ABOUT_TITLE}
            </Link>
            <Link
              href="#blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t.BLOG_TITLE}
            </Link>
            {employee ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover active:scale-95"
                >
                  {t.DASHBOARD}
                </Link>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {UI_TEXT.AUTH.LOGOUT}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover active:scale-95"
              >
                {UI_TEXT.AUTH.LOGIN}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full bg-orange-200/20 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
            <Flame className="h-3 w-3 animate-pulse text-orange-500" />
            {t.KITCHEN_TERMINAL}
          </div>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
            {t.HERO_TITLE} <br />
            <span className="text-primary italic">{t.HERO_SUBTITLE}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t.HERO_DESC}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {employee ? (
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 active:scale-95"
              >
                {t.DASHBOARD}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 rounded-lg bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 active:scale-95"
              >
                {t.ENTER_SYSTEM}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* KDS Preview */}
          <div className="mt-20 relative px-4 mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border-4 border-slate-800 bg-slate-900 shadow-2xl">
              <div className="absolute top-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-400 font-mono ml-2">{t.KDS_PREVIEW}</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop"
                alt="KDS Interface"
                className="mt-8 h-full w-full object-cover opacity-80 brightness-75 grayscale-[0.3]"
              />
              <div className="absolute inset-0 mt-8 flex items-center justify-center">
                <div className="bg-primary/90 text-primary-foreground p-6 rounded-xl backdrop-blur-md shadow-2xl border border-white/20">
                  <ChefHat className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">{t.KITCHEN_INTEL}</h3>
                  <p className="text-sm opacity-90">{t.TECH_REDUCING}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t.ABOUT_TITLE}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.ABOUT_DESC}</p>
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <span className="font-semibold">{t.ESTABLISHED}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="font-semibold">{t.TEAM_SIZE}</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop"
                className="rounded-3xl shadow-2xl"
                alt="Restaurant Business"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden lg:block">
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground font-medium text-slate-500 capitalize">
                  Đối tác tin cậy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Solutions Section */}
      <section className="bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl border-l-4 border-primary pl-6">
              {t.MISSION_CRITICAL}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl pl-10">{t.MISSION_DESC}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "KDS Integration",
                desc: "Live ticket tracking with dynamic coloring based on preparation urgency.",
                icon: MonitorPlay,
                color: "bg-order-cooking",
              },
              {
                title: "Smart Prep Lists",
                desc: "Automated preparation requirements based on real-time inventory levels.",
                icon: ClipboardList,
                color: "bg-primary",
              },
              {
                title: "Live Stock",
                desc: "Never run out of key ingredients with synchronized inventory.",
                icon: LayoutDashboard,
                color: "bg-order-completed",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-border bg-background p-8 transition-all hover:shadow-lg"
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${f.color} text-primary-foreground shadow-lg shadow-primary/10`}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-900 py-24 md:py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Quote className="h-64 w-64" />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl mb-4">{t.REVIEWS_TITLE}</h2>
            <p className="text-slate-400">{t.REVIEWS_DESC}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {t.REVIEWS_LIST.map((rev, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic text-slate-300 mb-6 leading-relaxed">"{rev.content}"</p>
                <div>
                  <p className="font-bold text-primary">{rev.author}</p>
                  <p className="text-sm text-slate-500">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">{t.BLOG_TITLE}</h2>
              <p className="mt-4 text-muted-foreground">{t.BLOG_DESC}</p>
            </div>
            <button className="flex items-center gap-2 text-primary font-bold group">
              {t.READ_MORE}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600",
                title: "Xu hướng 'Smart Kitchen' 2026: Tự động hóa và AI",
              },
              {
                img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600",
                title: "Kế hoạch mở rộng FoodHub sang thị trường SEA",
              },
              {
                img: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=600",
                title: "Bí quyết quản lý nhân sự hiệu quả trong giờ cao điểm",
              },
            ].map((blog, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-2xl mb-4">
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest mb-2">
                  <BookOpen className="h-3 w-3" />
                  Insight
                </div>
                <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2 opacity-80">
              <Utensils className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground uppercase tracking-tighter">
                FoodHub Internal
              </span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Safety Protocols
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Guidelines
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Admin Support
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 FoodHub Kitchen Management. Auth Required.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
