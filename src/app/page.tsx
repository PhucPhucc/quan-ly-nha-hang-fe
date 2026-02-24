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
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl border border-white/20 glass shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-lg shadow-primary/25">
              <Utensils className="h-5 w-5" />
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
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
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
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
              >
                {UI_TEXT.AUTH.LOGIN}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-float" />
          <div
            className="absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full bg-orange-300/20 blur-[100px] animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-yellow-200/20 blur-[80px] animate-float"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm shadow-sm animate-fade-in-up">
            <Flame className="h-4 w-4 animate-pulse text-orange-500" />
            {t.KITCHEN_TERMINAL}
          </div>

          <h1
            className="mt-8 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl text-balance animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t.HERO_TITLE} <br />
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic px-2">
              {t.HERO_SUBTITLE}
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-balance animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t.HERO_DESC}
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {employee ? (
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
              >
                {t.DASHBOARD}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-105 active:scale-95"
              >
                {t.ENTER_SYSTEM}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* KDS Preview */}
          <div
            className="mt-24 relative px-4 mx-auto max-w-6xl animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative overflow-hidden rounded-3xl border-4 border-slate-900/5 bg-slate-900 shadow-2xl transform transition-transform hover:scale-[1.01] duration-500">
              <div className="absolute top-0 w-full h-10 bg-slate-900 flex items-center px-4 gap-2 z-10 border-b border-slate-800">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 font-mono ml-4 opacity-50">
                  KDS v2.0 - Live Connection
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop"
                alt="KDS Interface"
                className="pt-10 h-full w-full object-cover opacity-80 brightness-75 grayscale-[0.2]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass p-8 rounded-3xl text-center max-w-md transform transition-all hover:scale-105 duration-300">
                  <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                    <ChefHat className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t.KITCHEN_INTEL}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">{t.TECH_REDUCING}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute -left-20 top-40 h-96 w-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-20 md:grid-cols-2 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
                {t.ABOUT_TITLE}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground text-balance">
                {t.ABOUT_DESC}
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-foreground">2023</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.ESTABLISHED}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-foreground">50+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.TEAM_SIZE}</p>
                </div>
              </div>
            </div>

            <div className="relative order-1 md:order-2 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-orange-400 rounded-[2.5rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop"
                className="relative rounded-[2rem] shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2 object-cover aspect-[4/3] w-full"
                alt="Restaurant Business"
              />
              <div
                className="glass absolute -bottom-8 -left-8 p-8 rounded-2xl hidden lg:block animate-float"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-4xl font-extrabold text-primary">500+</p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Partner Restaurants
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Solutions Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
              {t.MISSION_CRITICAL}
            </h2>
            <p className="text-lg text-muted-foreground text-balance">{t.MISSION_DESC}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "KDS Integration",
                desc: "Live ticket tracking with dynamic coloring based on preparation urgency.",
                icon: MonitorPlay,
                color: "bg-order-cooking",
                text: "text-white",
              },
              {
                title: "Smart Prep Lists",
                desc: "Automated preparation requirements based on real-time inventory levels.",
                icon: ClipboardList,
                color: "bg-primary",
                text: "text-white",
              },
              {
                title: "Live Stock",
                desc: "Never run out of key ingredients with synchronized inventory tracking.",
                icon: LayoutDashboard,
                color: "bg-order-completed",
                text: "text-white",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="glass-card p-8 rounded-3xl h-full flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} ${f.text} shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-border/50">
                  <span className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative py-24 md:py-32 bg-[#0F172A] text-white overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 p-20 opacity-5">
          <Quote className="h-96 w-96 transform rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0F172A] to-transparent z-10" />

        <div className="mx-auto max-w-7xl px-6 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-5xl mb-6">{t.REVIEWS_TITLE}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t.REVIEWS_DESC}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {t.REVIEWS_LIST.map((rev, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="italic text-slate-300 mb-8 leading-relaxed text-lg">
                  &quot;{rev.content}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{rev.author}</p>
                    <p className="text-sm text-slate-500">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-primary font-bold tracking-wider uppercase text-sm mb-2">
                News & Resources
              </div>
              <h2 className="text-4xl font-bold md:text-5xl">{t.BLOG_TITLE}</h2>
            </div>
            <button className="flex items-center gap-2 text-foreground font-bold group hover:text-primary transition-colors">
              {t.READ_MORE}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600",
                title: "Xu hướng 'Smart Kitchen' 2026: Tự động hóa và AI",
                date: "Jan 12, 2026",
              },
              {
                img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600",
                title: "Kế hoạch mở rộng FoodHub sang thị trường SEA",
                date: "Feb 03, 2026",
              },
              {
                img: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=600",
                title: "Bí quyết quản lý nhân sự hiệu quả trong giờ cao điểm",
                date: "Mar 15, 2026",
              },
            ].map((blog, i) => (
              <div key={i} className="group cursor-pointer flex flex-col h-full">
                <div className="overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-3">
                  <span className="bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                    {blog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Insight
                  </span>
                </div>
                <h3 className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card pb-12 pt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Utensils className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">FoodHub</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nền tảng quản lý nhà hàng 4.0, tối ưu hóa quy trình vận hành từ nhà bếp đến bàn ăn
                một cách liền mạch.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-foreground">Product</span>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Integrations
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-foreground">Company</span>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Carreers
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-foreground">Support</span>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Status
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026 FoodHub Kitchen Management. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
