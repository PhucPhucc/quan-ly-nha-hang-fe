"use client";

import { ArrowRight, Building, Loader2, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

// Assuming sonner is used, if not, I'll fallback. Nextjs shadcn usually has it. Let's stick to standard alert if unsure, but toast is better. Let's use alert for now to be safe, or just a simple UI state.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
// Wait, looking at the repo, they might have a custom toast or sonner.
// Actually, I can just use a simple setTimeout.

export function PartnerContactSection() {
  const { PARTNER_CONTACT } = UI_TEXT.LANDING;

  const [formData, setFormData] = useState({
    restaurantName: "",
    contactName: "",
    phone: "",
    email: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.restaurantName || !formData.contactName || !formData.phone) {
      alert("Vui lòng điền các thông tin bắt buộc!");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Gửi thông tin thành công! Chúng tôi sẽ sớm liên hệ với bạn.");
      setFormData({
        restaurantName: "",
        contactName: "",
        phone: "",
        email: "",
        note: "",
      });
    }, 1500);
  };

  return (
    <section id="partner-contact" className="py-24 bg-background scroll-mt-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <h3 className="text-primary font-bold uppercase tracking-widest text-sm">
                {PARTNER_CONTACT.SUBTITLE}
              </h3>
              <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                {PARTNER_CONTACT.TITLE_MAIN} <br />
                <span className="text-primary">{PARTNER_CONTACT.TITLE_ITALIC}</span>{" "}
                {PARTNER_CONTACT.TITLE_SUFFIX}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                {PARTNER_CONTACT.DESCRIPTION}
              </p>
            </div>

            <div className="flex items-center gap-4 group pt-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                <Phone className="h-5 w-5 group-hover:text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {PARTNER_CONTACT.HOTLINE_LABEL}
                </p>
                <p className="font-bold text-xl">{PARTNER_CONTACT.HOTLINE_NUMBER}</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - FORM LIÊN HỆ */}
          <div className="lg:col-span-7 bg-card rounded-[2.5rem] p-8 md:p-12 border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {/* Tên nhà hàng */}
              <div className="space-y-2.5 md:col-span-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {PARTNER_CONTACT.FORM.RESTAURANT_NAME_LABEL}
                </Label>
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <Building className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    value={formData.restaurantName}
                    onChange={(e) => updateField("restaurantName", e.target.value)}
                    placeholder={PARTNER_CONTACT.FORM.RESTAURANT_NAME_PLACEHOLDER}
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>

              {/* Người liên hệ */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {PARTNER_CONTACT.FORM.CONTACT_NAME_LABEL}
                </Label>
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    value={formData.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                    placeholder={PARTNER_CONTACT.FORM.CONTACT_NAME_PLACEHOLDER}
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {PARTNER_CONTACT.FORM.PHONE_LABEL}
                </Label>
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder={PARTNER_CONTACT.FORM.PHONE_PLACEHOLDER}
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2.5 md:col-span-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {PARTNER_CONTACT.FORM.EMAIL_LABEL}
                </Label>
                <div className="flex items-center group border-b-2 border-border/50 focus-within:border-primary transition-colors pb-1">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder={PARTNER_CONTACT.FORM.EMAIL_PLACEHOLDER}
                    className="border-0 pl-3 bg-transparent focus-visible:ring-0 text-lg font-medium h-10"
                  />
                </div>
              </div>

              {/* Lời nhắn */}
              <div className="md:col-span-2 space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                  {PARTNER_CONTACT.FORM.NOTE_LABEL}
                </Label>
                <Textarea
                  value={formData.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  placeholder={PARTNER_CONTACT.FORM.NOTE_PLACEHOLDER}
                  className="rounded-2xl min-h-[100px]"
                />
              </div>

              {/* Nút xác nhận */}
              <div className="md:col-span-2 pt-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl text-lg font-bold tracking-widest group uppercase shadow-xl shadow-primary/20"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    PARTNER_CONTACT.FORM.SUBMIT_BUTTON
                  )}
                  {!isLoading && (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  )}
                </Button>
                <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest">
                  {PARTNER_CONTACT.FORM.FOOTER_NOTE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
