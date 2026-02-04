"use client";

import { BookOpen, CalendarRange, Clock, LifeBuoy, ShieldCheck, Soup } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SharedResources() {
  const resources = [
    { title: "Standard Recipes", icon: Soup, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Shift Schedule", icon: CalendarRange, color: "text-blue-500", bg: "bg-blue-500/10" },
    {
      title: "Training Portal",
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    { title: "HACCP Logs", icon: ShieldCheck, color: "text-rose-500", bg: "bg-rose-500/10" },
    {
      title: "Kitchen IT Support",
      icon: LifeBuoy,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    { title: "Punch Clock", icon: Clock, color: "text-slate-500", bg: "bg-slate-500/10" },
  ];

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Shared Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {resources.map((res, i) => (
            <button
              key={i}
              className="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border bg-background hover:bg-slate-50 hover:border-primary/20 transition-all active:scale-95"
            >
              <div
                className={`p-2 rounded-lg ${res.bg} group-hover:scale-110 transition-transform`}
              >
                <res.icon className={`h-5 w-5 ${res.color}`} />
              </div>
              <span className="text-[10px] font-bold text-center text-muted-foreground group-hover:text-foreground uppercase tracking-tight">
                {res.title}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
