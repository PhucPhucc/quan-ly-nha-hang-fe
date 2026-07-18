/* eslint-disable react/jsx-no-literals */
"use client";

import {
  CalendarCheck,
  ChefHat,
  ExternalLink,
  Heart,
  Leaf,
  MapPin,
  Phone,
  Star,
  Utensils,
} from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";

import { Navbar } from "./components/Navbar";
import { ReservationSectionWrapper } from "./components/ReservationSectionWrapper";

const inter = Inter({ subsets: ["latin"] });

function RestaurantHero() {
  const { data: branding } = useBrandingSettings();

  const restaurantName = branding?.restaurantName || "Nhà hàng ẩm thực";
  const address = branding?.address || "123 Đường Ẩm Thực, Quận 1, TP.HCM";
  const phone = branding?.phone || "090 123 4567";

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#FFB000] rounded-full mix-blend-screen filter blur-[128px] opacity-10"
          style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        ></div>
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50/50 border border-orange-200 backdrop-blur-md mb-8">
            <Star className="w-4 h-4 text-[#FF6B00]" fill="currentColor" />
            <span className="text-sm font-medium text-orange-900">Chào mừng bạn đến với</span>
            <Star className="w-4 h-4 text-[#FF6B00]" fill="currentColor" />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight capitalize">
            {restaurantName}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto flex flex-col items-center gap-3">
            <span className="flex items-center gap-2">
              <MapPin className="text-[#FF6B00] w-5 h-5" /> {address}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="text-[#FF6B00] w-5 h-5" /> {phone}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#reservation"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] rounded-full text-white font-bold text-lg overflow-hidden shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:shadow-[0_0_40px_rgba(255,107,0,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <CalendarCheck className="w-5 h-5 relative" />
              <span className="relative">Đặt bàn ngay</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function RestaurantStory() {
  const { data: branding } = useBrandingSettings();
  const restaurantName = branding?.restaurantName || "Nhà hàng ẩm thực";
  const description =
    branding?.description ||
    `Tại ${restaurantName}, chúng tôi tin rằng mỗi bữa ăn không chỉ là thưởng thức ẩm thực, mà còn là một trải nghiệm văn hóa và gắn kết tình thân. Với nguồn nguyên liệu tươi ngon nhất và đôi bàn tay khéo léo của các đầu bếp tài năng, chúng tôi cam kết mang đến cho bạn những hương vị khó quên.`;

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <Image
                src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl hidden md:block">
              <div className="aspect-square w-48 relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500&auto=format&fit=crop"
                  alt="Delicious food"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#FF6B00] font-semibold text-sm mb-6">
              <Utensils className="w-4 h-4" /> Về chúng tôi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Hương vị đích thực,
              <br />
              không gian tuyệt vời.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-4xl font-extrabold text-[#FF6B00] mb-2">15+</p>
                <p className="text-gray-600 font-medium">Năm kinh nghiệm</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#FF6B00] mb-2">50+</p>
                <p className="text-gray-600 font-medium">Món ăn đặc sắc</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RestaurantHighlights() {
  const highlights = [
    {
      icon: <Leaf className="w-8 h-8 text-[#FF6B00]" />,
      title: "Nguyên liệu tươi sạch",
      desc: "Lựa chọn khắt khe từ các nông trại sạch, đảm bảo an toàn và hương vị tự nhiên nhất.",
    },
    {
      icon: <ChefHat className="w-8 h-8 text-[#FF6B00]" />,
      title: "Đầu bếp chuẩn sao",
      desc: "Đội ngũ đầu bếp giàu kinh nghiệm, am hiểu sâu sắc về nghệ thuật ẩm thực.",
    },
    {
      icon: <Heart className="w-8 h-8 text-[#FF6B00]" />,
      title: "Phục vụ tận tâm",
      desc: "Luôn đặt trải nghiệm của khách hàng lên hàng đầu với sự nhiệt tình và chuyên nghiệp.",
    },
  ];

  return (
    <section className="py-24 bg-orange-50/50 border-y border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
          Vì sao chọn chúng tôi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RestaurantFooter() {
  const { data: branding } = useBrandingSettings();

  const restaurantName = branding?.restaurantName || "Nhà hàng ẩm thực";
  const address = branding?.address || "123 Đường Ẩm Thực, Quận 1, TP.HCM";
  const phone = branding?.phone || "090 123 4567";
  const email = branding?.email;
  const operatingDays = branding?.operatingDays || "Thứ 2 - Chủ Nhật";
  const operatingHours = branding?.operatingHours || "08:00 - 22:00";

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#FF6B00]">{restaurantName}</h3>
            <p className="text-gray-400 mb-2 flex items-start gap-2">
              <MapPin className="w-5 h-5 shrink-0 text-gray-500" />
              {address}
            </p>
            <p className="text-gray-400 flex items-center gap-2">
              <Phone className="w-5 h-5 shrink-0 text-gray-500" />
              {phone}
            </p>
            {email && (
              <p className="text-gray-400 flex items-center gap-2 mt-2">
                <span className="w-5 h-5 flex items-center justify-center shrink-0 text-gray-500 font-bold">
                  @
                </span>
                {email}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold mb-2">Liên kết nhanh</h4>
            <Link href="/" className="text-gray-400 hover:text-[#FF6B00] transition-colors">
              Trang chủ
            </Link>
            <a href="#reservation" className="text-gray-400 hover:text-[#FF6B00] transition-colors">
              Đặt bàn
            </a>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Giờ mở cửa</h4>
            <p className="text-gray-400">{operatingDays}</p>
            <p className="text-[#FF6B00] font-medium">{operatingHours}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {restaurantName}. Tất cả các quyền được bảo lưu.
          </p>

          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm flex items-center gap-1 transition-colors"
          >
            Powered by <span className="font-bold text-[#00CCFF]">FoodHub</span>{" "}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function RestaurantLandingPage() {
  return (
    <div
      className={`min-h-screen bg-orange-50/30 text-gray-900 ${inter.className} selection:bg-[#FF6B00]/20 selection:text-[#FF6B00] overflow-x-hidden scroll-smooth`}
    >
      <Navbar />
      <RestaurantHero />
      <RestaurantStory />
      <RestaurantHighlights />
      <div id="reservation">
        <ReservationSectionWrapper />
      </div>
      <RestaurantFooter />
    </div>
  );
}
