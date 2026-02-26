"use client";

import { ArrowRight, ClipboardList, LayoutDashboard, MonitorPlay } from "lucide-react";

import { UI_TEXT } from "@/lib/UI_Text";

export function SolutionsSection() {
  const t = UI_TEXT.LANDING;

  const solutions = [
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
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl mb-6">
            {t.MISSION_CRITICAL}
          </h2>
          <p className="text-lg text-muted-foreground text-balance">{t.MISSION_DESC}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {solutions.map((f) => (
            <div
              key={f.title}
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
  );
}
