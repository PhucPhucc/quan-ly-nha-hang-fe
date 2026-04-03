/* eslint-disable react/no-unescaped-entities, react/jsx-no-literals */

const futureItems = [
  {
    title: "AI Predictions",
    description: "Dự đoán doanh thu và hành vi khách hàng bằng trí tuệ nhân tạo.",
  },
  {
    title: "Smarter Operations",
    description: "Tự động hóa quy trình đặt hàng nhà cung cấp khi kho sắp hết.",
  },
  {
    title: "SEA Expansion",
    description: "Mang giải pháp quản lý Việt Nam vươn tầm Đông Nam Á.",
  },
];

const peakHourMoments = [
  { time: "18:30", label: "Khách bắt đầu vào đông", emphasized: false },
  { time: "19:00", label: "Tất cả bàn đều kín", emphasized: false },
  { time: "19:10", label: "Mọi thứ bắt đầu lệch khỏi quỹ đạo", emphasized: true },
];

const brokenStates = ["Orders delayed", "Wrong dishes served", "Staff overwhelmed"];

const techSurvivalPoints = ["Sai sót vẫn xảy ra", "Giao tiếp vẫn lệch", "Vận hành vẫn rối"];

const techTags = ["Real-time sync", "Table tracking", "Stock visibility"];

export function OurStoryNarrativeSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-black py-32" data-purpose="struggle-section">
        <div className="absolute inset-0 opacity-20">
          <img
            alt="Messy desk"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzwYZPAs3thAzEa7NwVRNLuVMjbl4vHsaU9ZbvixGPkbTmvLrJwMXwD19Pgt4x1pAysWOzvS3ZJz7hn8axtfr8XODugIGcOUob7AFdMYFFvBZpmwF0dL6PaeUeRk_gqwNKR0QwvskH0rbd9wJWLwZ1fSicPVBsLpvqC1s1Uw_Wtj7w3hcq-5WFfXhlh1489fuo24sAPYAtRm5F6u_UZmGZb7cTDuB_fqz9hKxoD0wNc3zQYMb8SQT3Cf-cxkhKN-IFLt7LrNf87H25"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-3xl font-light uppercase tracking-widest md:text-5xl">
            "Không phải lúc nào cũng tiến về phía trước."
          </h2>
          <p className="mx-auto text-lg text-gray-400 md:w-2/3">
            Có những ngày hệ thống sụp đổ. Có những ngày chúng tôi muốn bỏ cuộc. Nhưng chính những
            vết sẹo đó đã tạo nên FoodHub mạnh mẽ của ngày hôm nay.
          </p>
        </div>
      </section>

      <section className="bg-white py-24 text-black" data-purpose="vision-section" id="vision">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <h2 className="mb-8 text-4xl font-extrabold">FoodHub vẫn đang tiếp tục.</h2>
              <ul className="space-y-6">
                {futureItems.map((item) => (
                  <li key={item.title} className="flex items-start">
                    <span className="mt-3 mr-4 h-2 w-2 flex-shrink-0 bg-primary" />
                    <div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <img
                alt="Sunrise city"
                className="rounded-2xl shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4VnRnGTolI9M_7OMH9s339R7EHza_xUp_skbtiSHS52h8qvGZ8kMl9bG_9R8N3ZiP5ILEiI9rwoX2x0PC7TnhdA5XwSBRe9KdWaNkUAXc_JhJV5k6ZJ5XXTPd53ul2bgNV1pahaqqvCwx6YNmuag7GMIAvfiCwo6FvmARbDcbN2f638Sg-F_weI28GT372w6mzjDo2eIwbh4ByxPUiCWHn0eVUhvBBZt0uLev5ueXDoWGZvZ0tu3lY4gq3PaUAhPc28IJqvN1JmkY"
              />
              <div className="absolute -right-6 -bottom-6 hidden bg-primary p-8 text-white md:block">
                <p className="text-4xl font-black">2025</p>
                <p className="text-xs font-bold uppercase tracking-widest">Lộ trình tương lai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-black py-24" data-purpose="peak-hour-chaos">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              {peakHourMoments.map((moment) => (
                <div key={moment.time} className="flex items-center space-x-4">
                  <span className="font-mono text-xl text-primary">{moment.time}</span>
                  <p className={moment.emphasized ? "font-bold text-white" : "text-gray-400"}>
                    — {moment.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-l border-primary/30 py-2 pl-6">
              {brokenStates.map((state) => (
                <p key={state} className="text-gray-500 line-through decoration-primary">
                  {state}
                </p>
              ))}
            </div>

            <h2 className="text-4xl leading-tight font-black text-white">
              Tất cả chỉ diễn ra trong <span className="text-primary italic">30 phút.</span>
            </h2>

            <blockquote className="border-l-4 border-primary pl-6 text-2xl font-light italic text-gray-300">
              "Vấn đề không nằm ở con người — mà là hệ thống."
            </blockquote>

            <div className="flex items-center space-x-6 pt-8">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Và đó là lý do FoodHub tồn tại.
              </p>
              <button
                type="button"
                className="bg-primary px-4 py-2 text-xs font-black uppercase tracking-tighter transition hover:bg-neutral-800"
              >
                Xem cách FoodHub giải quyết
              </button>
            </div>
          </div>

          <div className="group relative">
            <div className="kitchen-overlay absolute inset-0 z-10 transition duration-700 group-hover:opacity-0" />
            <img
              alt="Kitchen chaos blurred"
              className="h-[600px] w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
              src="https://images.unsplash.com/photo-1663790776790-680c6282da2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <div className="absolute right-0 bottom-0 z-20 p-8 text-right">
              <div className="mb-4 ml-auto h-1 w-20 bg-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                Peak Hour Visualization
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-32" data-purpose="tech-survival">
        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <img
              alt="Hands using POS tablet"
              className="rounded-lg border border-white/5 opacity-80 grayscale shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgA9ICs8wFLDCysapTv5WZz9Q2aBLMcU_3EvnvOuQ8FqMvPPzWhbMNWJeem9ZwdoIr8MHpVwrGWy0133SJnWn0oB2TyHa4qEYt0n_M5yD2e6uJWKpLhNwBiwZMmxHOXMbI5yF1lliFb4tgSueqk0Hg_Mih9C-BIfwYXDoSkt4O6392ZQg8Emrezq0nMwTuYzkH-zS0O6tKvroVgC1XAIFR1UbKCrt6vNx2d6znlmSW682WrF_XmwNtmVDIjL2fNQbMOgmaRNU-jhKZ"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 animate-pulse rounded-full bg-primary/20 blur-3xl" />
            </div>
          </div>

          <div className="order-1 space-y-8 md:order-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Đối đầu thực tại
              </span>
              <h2 className="mt-4 mb-6 text-4xl leading-tight font-extrabold">
                Trong nhiều năm, giải pháp của nhà hàng là:{" "}
                <span className="text-primary italic">thuê thêm người.</span>
              </h2>
              <ul className="space-y-4">
                {techSurvivalPoints.map((point) => (
                  <li key={point} className="flex items-center text-gray-400">
                    <svg
                      className="mr-3 h-5 w-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-y border-white/5 py-6">
              <p className="mb-2 text-xl font-bold text-white">
                Thêm người không giải quyết được vấn đề hệ thống.
              </p>
              <p className="text-3xl font-black tracking-tighter text-primary md:text-5xl">
                Công nghệ không phải để trông hiện đại. Nó là để tồn tại.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {techTags.map((tag) => (
                <div
                  key={tag}
                  className="border-b border-white/10 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500"
                >
                  {tag}
                </div>
              ))}
            </div>

            <p className="pt-4 text-sm italic text-gray-500">
              "Khách không nhìn thấy hệ thống. Nhưng họ luôn cảm nhận được nó."
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary py-24" data-purpose="cta-section" id="cta">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-4xl leading-tight font-black text-white md:text-6xl">
            Bạn không chỉ sử dụng một hệ thống.
            <br />
            Bạn đang trở thành một phần của hành trình.
          </h2>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              className="bg-black px-10 py-5 font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-900"
            >
              Trải nghiệm FoodHub
            </button>
            <button
              type="button"
              className="border-2 border-white px-10 py-5 font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-primary"
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
