/* eslint-disable react/no-unescaped-entities, react/jsx-no-literals */

export function OurStoryProblemSection() {
  return (
    <section className="bg-[#121212] py-24" data-purpose="problem-section">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Thực trạng
          </span>
          <h2 className="mt-4 mb-8 text-4xl font-bold">Khi đam mê bị bóp nghẹt bởi sự hỗn loạn.</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-400">
            Chúng tôi đã chứng kiến những chủ nhà hàng kiệt sức không phải vì nấu ăn, mà vì quản lý.
            Những tờ order thất lạc, kho bãi chồng chéo, và sự thiếu hụt kết nối giữa bếp và sảnh.
          </p>
          <blockquote className="border-l-4 border-primary pl-6 text-2xl font-light italic text-white">
            "Vấn đề không nằm ở con người — mà ở hệ thống."
          </blockquote>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative overflow-hidden rounded-lg grayscale contrast-125">
            <img
              alt="Hỗn loạn nhà hàng"
              className="h-[500px] w-full object-cover motion-safe:animate-pulse"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-SDG4JgYQBguAvrjOlpfqUxSYHIAJUnuOsN7DEHM19uBzRUttqui14Pvw2VCnrJY6h38oDopKhco1eHI_6f6u57N--XWGvkbp0cP2oNv7k5hIoTmJYh8wSO3F0mLaCZwzzD3ffXv08UqvmxYuSbmg_s0jsBXbkJrM-SDl16lP3jHzYCh9tHzfNi61JZfsgsPpZorCtexfJFRlLoKcszkgEQilOZa-Gb3aXu3k8zOn76giWyjtdjmpZ9IkHf3vqw7D-AixWZuzYxnp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
