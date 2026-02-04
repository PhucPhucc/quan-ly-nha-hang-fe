"use client";

import {
  ArrowRight,
  ChefHat,
  ClipboardList,
  Flame,
  LayoutDashboard,
  MonitorPlay,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { useAuthStore } from "@/store/useAuthStore";

export default function LandingPage() {
  const { employee } = useAuthStore();
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
              href="#solutions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              KDS & Kitchen
            </Link>
            <Link
              href="#operations"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Operations
            </Link>
            {employee ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="rounded-lg bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground shadow-sm border border-border transition-all hover:bg-muted active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-foreground">
                  Staff Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
        {/* Background Decorations - Using Primary/Orange themes */}
        <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[5%] h-[400px] w-[400px] rounded-full bg-orange-200/20 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
            <Flame className="h-3 w-3 animate-pulse text-orange-500" />
            Optimized for High-Volume Kitchens
          </div>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
            Streamline Your <br />
            <span className="text-primary italic">Culinary Workflow</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            From table-side ordering to the heat of the line. FoodHub provides the digital backbone
            for modern restaurant operations and smart kitchen management.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {employee ? (
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 active:scale-95"
              >
                Enter Workspace
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 active:scale-95"
              >
                Access System
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            {!employee && (
              <Link
                href="/login"
                className="rounded-lg bg-card px-8 py-4 text-lg font-bold text-card-foreground shadow-sm border border-border transition-all hover:bg-muted active:scale-95"
              >
                Kitchen Log
              </Link>
            )}
          </div>

          {/* Kitchen Display System Preview */}
          <div className="mt-20 relative px-4 mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border-4 border-slate-800 bg-slate-900 shadow-2xl">
              <div className="absolute top-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-400 font-mono ml-2">
                  FOODHUB_KDS_TERMINAL_01
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop"
                alt="KDS Interface"
                className="mt-8 h-full w-full object-cover opacity-80 brightness-75 grayscale-[0.3]"
              />
              <div className="absolute inset-0 mt-8 flex items-center justify-center">
                <div className="bg-primary/90 text-primary-foreground p-6 rounded-xl backdrop-blur-md shadow-2xl border border-white/20">
                  <ChefHat className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Kitchen Intelligence</h3>
                  <p className="text-sm opacity-90">Reducing ticket times by 24% on average</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Solutions Section */}
      <section id="solutions" className="bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl border-l-4 border-primary pl-6">
              Mission Critical for BOH
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl pl-10">
              Software tailored specifically for the Back-of-House (BOH) heat and pace.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Active KDS Integration",
                desc: "Live ticket tracking with dynamic coloring based on preparation urgency and table priority.",
                icon: MonitorPlay,
                color: "bg-order-cooking",
              },
              {
                title: "Smart Prep Lists",
                desc: "Automated preparation requirements based on historical data and real-time inventory levels.",
                icon: ClipboardList,
                color: "bg-primary",
              },
              {
                title: "Live Stock Monitoring",
                desc: "Never run out of key ingredients. Synchronized inventory with POS and vendor systems.",
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

      {/* Status Indicators Section */}
      <section className="bg-background py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap justify-center gap-12 opacity-80 grayscale transition-all hover:grayscale-0">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-order-pending shadow-[0_0_10px_rgba(var(--order-pending),0.5)]"></span>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Order Pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-order-cooking animate-pulse shadow-[0_0_10px_rgba(var(--order-cooking),0.5)]"></span>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              In Kitchen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-order-ready shadow-[0_0_10px_rgba(var(--order-ready),0.5)]"></span>
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Ready to Serve
            </span>
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
                Kitchen Guidelines
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
