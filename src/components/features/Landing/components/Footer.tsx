"use client";

import { Utensils } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
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
              Nền tảng quản lý nhà hàng 4.0, tối ưu hóa quy trình vận hành từ nhà bếp đến bàn ăn một
              cách liền mạch.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">Product</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Integrations
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">Company</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Carreers
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-foreground">Support</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
  );
}
