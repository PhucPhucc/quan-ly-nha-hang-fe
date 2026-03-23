"use client";

import { Quote, Star } from "lucide-react";

import { UI_TEXT } from "@/lib/UI_Text";

const QUOTE_MARK_MOCK = '"';

export function ReviewsSection() {
  const t = UI_TEXT.LANDING;

  return (
    <section className="relative py-24 md:py-32 bg-[#0F172A] text-white overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 p-20 opacity-5">
        <Quote className="h-96 w-96 transform rotate-12" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-[#0F172A] to-transparent z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold md:text-5xl mb-6">{t.REVIEWS_TITLE}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t.REVIEWS_DESC}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {t.REVIEWS_LIST.map((rev) => (
            <div
              key={rev.author}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`star-${rev.author}-${i}`}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="font-serif italic text-slate-300 mb-8 leading-relaxed text-lg text-balance">
                <span className="text-primary italic mr-1">{QUOTE_MARK_MOCK}</span>
                {rev.content}
                <span className="text-primary italic ml-1">{QUOTE_MARK_MOCK}</span>
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white text-sm">
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
  );
}
