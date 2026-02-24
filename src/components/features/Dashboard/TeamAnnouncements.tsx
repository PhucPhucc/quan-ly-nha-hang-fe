"use client";

import { AlertCircle, Calendar, Megaphone, Pin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

export function TeamAnnouncements() {
  const t = UI_TEXT.DASHBOARD;
  const announcements = [
    {
      id: 1,
      type: "urgent",
      title: "Bảo trì tủ đông tổng",
      time: "Hôm nay, 14:00 - 16:00",
      content: "Đội bảo trì sẽ đến kiểm tra máy nén. Vui lòng hạn chế mở cửa tủ.",
      tag: "Bảo trì",
    },
    {
      id: 2,
      type: "info",
      title: "Đào tạo Thực đơn mới",
      time: "Ngày mai, 09:00",
      content:
        "Tất cả nhân viên phục vụ và bếp trưởng phải tham gia buổi nếm thử và trình bày món cho Thực đơn Xuân.",
      tag: "Đào tạo",
    },
    {
      id: 3,
      type: "event",
      title: "Tiệc công ty: Tech Corp Dinner",
      time: "06/02, 19:00",
      content: "Đặt trước cho 45 khách tại phòng VIP. Yêu cầu thực đơn set menu riêng.",
      tag: "Sự kiện",
    },
  ];

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            {t.BULLETIN_TITLE}
          </CardTitle>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white px-2 py-1 rounded border">
            {t.BULLETIN_TAG}
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
          {t.VIEW_ALL}
        </button>
      </CardContent>
    </Card>
  );
}
