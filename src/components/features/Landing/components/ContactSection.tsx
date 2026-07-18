/* eslint-disable react/jsx-no-literals */
"use client";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Gửi yêu cầu thành công!", {
      description: "Chuyên viên của FoodHub sẽ liên hệ với bạn trong thời gian sớm nhất.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-24 bg-card relative border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-background border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-primary/5">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Liên hệ hợp tác
            </h2>
            <p className="text-muted-foreground text-lg">
              Để lại thông tin để nhận tư vấn và bản demo miễn phí từ chuyên gia FoodHub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Tên nhà hàng <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-transparent border-b-2 border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors font-medium text-lg"
                  placeholder="VD: Bếp Quê"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Tên người liên hệ <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-transparent border-b-2 border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors font-medium text-lg"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-transparent border-b-2 border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors font-medium text-lg"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Số điện thoại <span className="text-destructive">*</span>
                </label>
                <input
                  required
                  type="tel"
                  className="w-full bg-transparent border-b-2 border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors font-medium text-lg"
                  placeholder="090 123 4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-widest">
                Gói quan tâm
              </label>
              <select className="w-full bg-transparent border-b-2 border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors font-medium text-lg cursor-pointer [&>option]:bg-background">
                <option value="starter">Starter - Dùng thử miễn phí</option>
                <option value="professional">Professional - Nhà hàng tầm trung</option>
                <option value="enterprise">Enterprise - Chuỗi F&B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-widest">
                Ghi chú thêm
              </label>
              <textarea
                rows={3}
                className="w-full bg-transparent border-b-2 border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors font-medium text-lg resize-none"
                placeholder="Bạn có yêu cầu đặc biệt nào không?"
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1 flex justify-center items-center gap-2 group tracking-widest uppercase"
              >
                Gửi yêu cầu tư vấn{" "}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
