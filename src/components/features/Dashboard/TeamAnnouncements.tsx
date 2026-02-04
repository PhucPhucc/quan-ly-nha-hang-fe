"use client";

import { AlertCircle, Calendar, Megaphone, Pin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamAnnouncements() {
  const announcements = [
    {
      id: 1,
      type: "urgent",
      title: "Main walk-in fridge maintenance",
      time: "Today, 14:00 - 16:00",
      content:
        "Maintenance team will be on-site to check the compressor. Please minimize door openings.",
      tag: "Maintenance",
    },
    {
      id: 2,
      type: "info",
      title: "New Set Menu training",
      time: "Tomorrow, 09:00",
      content:
        "All servers and chefs must attend the tasting and plating session for the Spring Menu.",
      tag: "Training",
    },
    {
      id: 3,
      type: "event",
      title: "Private Event: Tech Corp Dinner",
      time: "Feb 6th, 19:00",
      content: "Booking for 45 pax in the VIP Lounge. Specific set menu required.",
      tag: "Event",
    },
  ];

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Internal Bulletin
          </CardTitle>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white px-2 py-1 rounded border">
            Official Notices
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 hover:bg-slate-50 transition-colors group">
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 p-2 rounded-lg ${
                    ann.type === "urgent"
                      ? "bg-rose-100 text-rose-600"
                      : ann.type === "info"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {ann.type === "urgent" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : ann.type === "info" ? (
                    <Pin className="h-4 w-4" />
                  ) : (
                    <Calendar className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors">
                      {ann.title}
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {ann.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-3 bg-slate-50 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          View All Announcements
        </button>
      </CardContent>
    </Card>
  );
}
