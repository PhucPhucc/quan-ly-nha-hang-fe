/* eslint-disable react/no-unescaped-entities, react/jsx-no-literals */
import { headers } from "next/headers";

import { Footer } from "@/components/features/Landing/components/Footer";
import { Navbar } from "@/components/features/Landing/components/Navbar";

export default async function NewsPage(props: { params: Promise<{ newsid: string }> }) {
  const params = await props.params;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  if (params.newsid === "our-story") {
    return (
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-black text-white antialiased">
        <style
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in-up 1s ease-out forwards;
          }
          .hero-gradient {
            background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(204,0,0,0.6)), url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }
          .red-glow { 
            box-shadow: 0 0 20px rgba(204, 0, 0, 0.4);
          }
          .timeline-line {
            width: 2px;
            background: linear-gradient(to bottom, transparent, #CC0000, transparent);
          }
          .kitchen-overlay {
            background: linear-gradient(45deg, rgba(204, 0, 0, 0.3), transparent);
          }
        `,
          }}
        />

        <Navbar />

        <div className="pt-20">
          {/* BEGIN: Hero Section */}
          <section
            className="relative h-screen flex items-center justify-center overflow-hidden hero-gradient"
            data-purpose="hero-section"
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                8 con người. <br /> 0 nguồn lực.
                <br />
                <span className="text-primary italic">1 hành trình không dễ dàng.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                FoodHub được xây dựng từ những đêm trắng, những lần thất bại, và một niềm tin không
                ai nhìn thấy.
              </p>
              <div className="mt-10">
                <div className="mt-10 flex justify-center gap-3">
                  <div className="w-1 h-15 bg-primary animate-bounce opacity-50 [animation-delay:-0.3s]"></div>
                  <div className="w-1 h-15 bg-primary animate-bounce opacity-50 [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-15 bg-primary animate-bounce opacity-50"></div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Hero Section */}

          {/* BEGIN: Problem Section */}
          <section className="py-24 bg-[#121212]" data-purpose="problem-section">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">
                  Thực trạng
                </span>
                <h2 className="text-4xl font-bold mt-4 mb-8">
                  Khi đam mê bị bóp nghẹt bởi sự hỗn loạn.
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  Chúng tôi đã chứng kiến những chủ nhà hàng kiệt sức không phải vì nấu ăn, mà vì
                  quản lý. Những tờ order thất lạc, kho bãi chồng chéo, và sự thiếu hụt kết nối giữa
                  bếp và sảnh.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 italic text-2xl text-white font-light">
                  "Vấn đề không nằm ở con người — mà ở hệ thống."
                </blockquote>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative rounded-lg overflow-hidden grayscale contrast-125">
                  <img
                    alt="Hỗn loạn nhà hàng"
                    className="w-full h-[500px] object-cover motion-safe:animate-pulse"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-SDG4JgYQBguAvrjOlpfqUxSYHIAJUnuOsN7DEHM19uBzRUttqui14Pvw2VCnrJY6h38oDopKhco1eHI_6f6u57N--XWGvkbp0cP2oNv7k5hIoTmJYh8wSO3F0mLaCZwzzD3ffXv08UqvmxYuSbmg_s0jsBXbkJrM-SDl16lP3jHzYCh9tHzfNi61JZfsgsPpZorCtexfJFRlLoKcszkgEQilOZa-Gb3aXu3k8zOn76giWyjtdjmpZ9IkHf3vqw7D-AixWZuzYxnp"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Problem Section */}

          {/* BEGIN: Journey Timeline */}
          <section className="py-24 bg-black relative" data-purpose="journey-timeline" id="journey">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-4xl font-extrabold">Cột mốc của sự kiên trì</h2>
                <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
              </div>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full timeline-line hidden md:block"></div>
                {/* Milestones */}
                <div className="space-y-24">
                  {/* Milestone 1 */}
                  <div className="relative flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-5/12 text-center md:text-right mb-8 md:mb-0">
                      <h3 className="text-2xl font-bold text-primary">Bắt đầu từ con số 0</h3>
                      <p className="text-gray-400 mt-2">
                        Chỉ có ý tưởng và những chiếc laptop cũ. Không văn phòng, không đầu tư,
                        không kỳ vọng. Chỉ có đam mê và sự quyết tâm.
                      </p>
                    </div>
                    <div className="z-10 w-4 h-4 bg-primary rounded-full red-glow"></div>
                    <div className="md:w-5/12 mt-8 md:mt-0">
                      <img
                        alt="Shadow of team"
                        className="rounded-lg opacity-60 grayscale hover:grayscale-0 transition duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Sj8M56b_ZV7gRmV3GbBw6atD7B5klFOy8Kggy3y-BObZPputtQvRhLOFDdENE2dBRxjTr6K7lolR8gyPoCDsJuqlHVOOO3nk8_N8PiNAwtafdb7SKcQ6ifaGqPqrqrCDIkYGD5fVec8J-zPGtfm9xqCPcfJ732iw2kg4omyYckxmPZSTp0X2g8RXenepBV3EphJj-6OaNA-g4dPyKLu6qOQC8eIImwdymYzwg_VLqWxhw3JLQrP1fF4nIJxcTdW4W2s5RCAW1_CX"
                      />
                    </div>
                  </div>
                  {/* Milestone 2 */}
                  <div className="relative flex flex-col md:flex-row-reverse items-center justify-between">
                    <div className="md:w-5/12 text-center md:text-left mb-8 md:mb-0">
                      <h3 className="text-2xl font-bold text-primary">Những đêm 3 giờ sáng</h3>
                      <p className="text-gray-400 mt-2">
                        Có những đêm, ánh sáng duy nhất là từ màn hình laptop và những dòng code
                        lỗi. Cà phê nguội đi. Thời gian trôi qua. Và áp lực thì không biến mất.
                        <br />
                        <br />
                        Chúng tôi không chỉ viết code — chúng tôi học cách chịu đựng, học cách tiếp
                        tục ngay cả khi không còn chắc chắn mình đang đi đúng hướng.
                      </p>
                    </div>
                    <div className="z-10 w-4 h-4 bg-primary rounded-full red-glow"></div>
                    <div className="md:w-5/12 mt-8 md:mt-0">
                      <img
                        alt="Hands typing"
                        className="rounded-lg opacity-60 grayscale hover:grayscale-0 transition duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAojMAh4aD5CoSinLWlEUfx-jAKyWLxZ4X05MbJJKFVlBfzodT9ha7UiqB5GOnHuBy6DKT2IQK-_KYOTzEPhnmP704SHiLWxIFtX-gZU1j1cPO67m3wwY0gKhEIP78Bm0trYkXMBZIxOQPiGgFuVb1qKa_aZH_9gojClprvmSLTgxLC_jCSm4np5t45Pl-bGdnbjcI5v4m7-HfMcx04JVmUygSOE2XYnZAA8cEcMEMFfQVnVZE0ncsxbDJ6eDi2yW5xvidFcpnT-2BY"
                      />
                    </div>
                  </div>
                  {/* Milestone 3 */}
                  <div className="relative flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-5/12 text-center md:text-right mb-8 md:mb-0">
                      <h3 className="text-2xl font-bold text-primary">Dám đưa vào thực tế</h3>
                      <p className="text-gray-400 mt-2">
                        Không còn là bản demo. Không còn là ý tưởng. Lần đầu tiên, FoodHub được sử
                        dụng trong một quán ăn thật.
                        <br />
                        <br />
                        Chúng tôi đứng đó — không phải với sự tự tin, mà với sự hồi hộp đến nghẹt
                        thở.
                        <br />
                        <br />
                        Và khi đơn hàng đầu tiên chạy thành công, chúng tôi biết: đây không còn chỉ
                        là một dự án.
                      </p>
                      <br />
                      <p>Sau tất cả… đó là một giấc mơ</p>
                    </div>
                    <div className="z-10 w-4 h-4 bg-primary rounded-full red-glow"></div>
                    <div className="md:w-5/12 mt-8 md:mt-0">
                      <img
                        alt="Restaurant blur"
                        className="rounded-lg opacity-60 grayscale hover:grayscale-0 transition duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAd7GcvWYtzdH7U7KScm9Dg6U8wNmPuBRIhlgXRizuLnLo_hOH2V50_oGqAZrq2xoLZoXZv3yo3jlQden3z2xV_kMQD1rZheAbzvbrA92IkTYIfaANRDX75UTOv3dmHreaU6H3YCqxpuc4pGhk8miUl0G472oBczb_yF7f72cKQl6LcsT0AWRRi1NKamZ0srEjtOSowgitvKPiNXqxQoldl3PObHVOFt7-gBdzZiZslz0Om4tV-McWDjzxXWAi87tEX16JqSX3I3rN"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Journey Timeline */}

          {/* BEGIN: Team Section */}
          <section className="py-24 bg-[#121212]" data-purpose="team-grid">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <h2 className="text-3xl font-bold italic tracking-tighter">
                  NHỮNG CÁI BÓNG PHÍA SAU MÀN HÌNH
                </h2>
                <p className="text-gray-500 mt-2">8 con người, 1 sứ mệnh chung.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="Backend silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGr4bmM3bcyPU2c2BbInnYQWkUFLr01bzd_gPcvkrCgM5DDj8DOREQgVxGGY5oV4QBWqMd19SbidjtQnqfhZPIz2g_XeRzHxTFM0_rfcqLgilh1jcPEKNPzE5bEuwrflC_hmH8n6cxLJNMBGXmby-0rOm-HWP8D3vhZ0SuhPjYPnb-RpaqWK-nN0tEkKZ1nsE2lRSTYhKX5VR7RpmJgiicpq5xPfXxo_i_j8bw0GOscknknktWk5kCrIs4NllZYu6UqMgSfbajhwWz"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">Backend</p>
                    <p className="text-xs text-gray-400">Người fix bug lúc 3h sáng</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="Frontend silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvcjCE0sPacr7H3YpDiQv5rCV8Y8ZVln4nx32lYX6TS7BdkkTQeUiLh6fuFq5gUPaY8DtIdX2TpB0tBbnAkAhamTU9Qaz-ZCMK5Uwt0SaqtMz4SRyA-_p4lIYgel6x3zOa5x2gkwPEXbGyOunZiKGQ7gsh_Yc44BLC7rl-WUJDU_Mdv0CuJ02kTznzde4f4LaEAGaC4X-5tLWS5LZaaAF7bxakpnwL21YuKo5ek9vX-LMIGlG4GyFxbmk1qCTtVzkqfJfBgAV37oGA"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">Frontend</p>
                    <p className="text-xs text-gray-400">Kiến trúc sư của sự trải nghiệm</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="Product silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0WukNWxns9iUcSaLhi6ixzEO2RtUtGMwo6vGbhaSQyGXyvNIm5J8YOYaJ-R1bxZIougEfsKyvA2DmNX8IszDY-w0QAXHoZhp-x3URee5kLlj7-wzn8daqRJez0-4wrj5UWD-Z7S82m8Og_oQ2EYXnIaEk7hv2ovJ-lyJwXMfij-S2RwiBtXDFTJACEfJHtNoyLc2NVcLy8_jeDLBuemnsO1P-LxmdtOTOdLBm46Ggn7spfcMoIoQImceFw-8--oIZeVVt0vIUdk6S"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">Product / BA</p>
                    <p className="text-xs text-gray-400">Kẻ mơ mộng thực tế</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="QA silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7thQOfcLnxtu8iHwaEjQTcOjBf1xTysFmqNRp2GDfA_m-P-4V2LKCf-ak9YyAzujGj0EF31r1sl05122qTA7UHMt69vKcuHOl9utArEg39GlXarAl-Mr-RbdRijrQ96oL4_HZFFGx15442zrsdUrEsO2y-YUyKzfUt3QQE2TKjtwfeWmPJaGPmzg9RNlFZkqr03u8rkClmVFVMowAFvcMi6KH7XwXnTU19nkiERGDsBktqGuG5B2-NaU-3d1PUrakidW5nUICmobb"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">QA</p>
                    <p className="text-xs text-gray-400">Người tìm thấy lỗi trong sự hoàn hảo</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="Designer silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRZTSCUZEHRk7Rs9ZRSU-bjLaXhVB9IX7H8EXHHT0JjKlQYg7v3HSYIrsktzSVUAXHam3WVL7vytGP-8IQ-0_2SN3R9sB-dLSY2GZSwCOaoEqFK_psvaNVfQdFgSHWoLXTbhnaNyfSBpz0rUuRPsLGvFQuus3bTwVeIuPTRzdD5HE9jj1T2WgqVnM0zXRbJFSfQvgWzLwhVCxfbNarBvmOjIUXa5lxjA_TRsx8HixwvY9YBv1AvALiBSN3rCCcVVdBPZDs1NV8Dt35"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">Designer</p>
                    <p className="text-xs text-gray-400">Người thổi hồn vào những con số</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="DevOps silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS5HRqHExuZ_7Fx4GSojqeo7B9oi3-pe9N8Fzd-f5PXHfSLVKqs0FGdWC6Z6YPvtetnzPNVmux63TDdNg9zun1ecXij6H-6lUdzLfTCtiDkyMpVJO_Ai0E5Pp_ylxs_DQHuzeq7lj55KDscq_NA3pos8EC-CxoWnH36nysQBbt7oZa6hel3dxC631QAiv9sDiUSQ2sDT7Vk6mzlcyHyOMOSiSl9Wx5kM-z36vdjvsbOHh2WPTUHRyFE5d-zhh4TjQH-YREL_11DLuV"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">DevOps</p>
                    <p className="text-xs text-gray-400">Lá chắn cho sự ổn định</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="Marketing silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhXAh7SSBYNv5T8oGsEz83fjXaYCRu6Zq4pDyxFpnPO0jfPSIAGzGhZfqAm8H4ZY7jdN3hDJZNTXjcYnbfs_y33ziTf9yKZmyqqrcrb_AhEzmhyhreL-GCG-WZqxqLLy6IV_Ie2YfLa19B4j1K1kLljP6mcb_h-iEELYyjG0zL0kXBwsbNTu5s5qbrb7av68ZyeG9dCfkLrPZquAF4pCGDz2XG37HIF2uF5JMUvQ84w1pB1sgnXuZqk_I2Uu-NfYL3DEjNCSQ8JcVO"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">Pentester</p>
                    <p className="text-xs text-gray-400">Tuyến phòng thủ thầm lặng</p>
                  </div>
                </div>
                <div className="group relative aspect-square bg-black overflow-hidden border border-white/5">
                  <img
                    alt="Support silhouette"
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:opacity-60 transition duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQTDygXiNZumJSC4T5ogwhbG1uLdZRBOylZtQkoyyKZWGiyxZ3CcZRuuNOIIha46NKe55HeUZcOdEkxJKYTEmZyqYfnbSS9dErwG3nKdmCaaDvPX89zw4SEqojDG3ykI4wS7i0pgALdbVoZq_iamOAar6PvD1NMnygUgNaxfgpmtIEMQDwt6CD_OnQzLI7YLEqQQUQ6qgrkjQNRHw-FA_EH1Q7UAlRuEoG73eITQEMiFyYfnu0OqBUxwH1oQ901cVaGGAp461YVxO"
                  />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-primary font-bold text-sm">Support</p>
                    <p className="text-xs text-gray-400">Người bạn đồng hành tận tâm</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Team Section */}

          {/* BEGIN: Product Value Section */}
          <section
            className="py-24 bg-white text-black"
            data-purpose="product-features"
            id="product"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                  <h2 className="text-5xl font-black tracking-tighter leading-none mb-6">
                    GIÁ TRỊ
                    <br />
                    <span className="text-primary">CỐT LÕI.</span>
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Chúng tôi không bán phần mềm. Chúng tôi bán sự an tâm cho nhà hàng của bạn.
                  </p>
                  <div className="p-6 bg-gray-50 border-l-4 border-primary">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Dashboard Preview
                    </p>
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                      <div className="w-full h-full p-4 space-y-3">
                        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-10 bg-primary/20 rounded"></div>
                          <div className="h-10 bg-primary/20 rounded"></div>
                          <div className="h-10 bg-primary/20 rounded"></div>
                        </div>
                        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                  <div className="p-8 border border-gray-100 hover:shadow-xl transition group">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center mb-6">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Quản lý bàn thông minh</h3>
                    <p className="text-gray-600">
                      Sơ đồ bàn trực quan, tối ưu hóa không gian và thời gian phục vụ khách hàng.
                    </p>
                  </div>
                  <div className="p-8 border border-gray-100 hover:shadow-xl transition group">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center mb-6">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Đồng bộ Order thời gian thực</h3>
                    <p className="text-gray-600">
                      Không còn sai lệch giữa nhân viên phục vụ và bếp. Tốc độ là ưu tiên hàng đầu.
                    </p>
                  </div>
                  <div className="p-8 border border-gray-100 hover:shadow-xl transition group">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center mb-6">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Kiểm soát kho chặt chẽ</h3>
                    <p className="text-gray-600">
                      Tự động trừ định mức nguyên liệu. Cảnh báo hết hàng trước khi quá muộn.
                    </p>
                  </div>
                  <div className="p-8 border border-gray-100 hover:shadow-xl transition group">
                    <div className="w-12 h-12 bg-primary text-white flex items-center justify-center mb-6">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Tối ưu giờ cao điểm</h3>
                    <p className="text-gray-600">
                      Sử dụng dữ liệu để dự báo và chuẩn bị, giúp nhà hàng vận hành mượt mà lúc đông
                      nhất.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* END: Product Value Section */}

          <section
            className="relative py-32 bg-black overflow-hidden"
            data-purpose="struggle-section"
          >
            <div className="absolute inset-0 opacity-20">
              <img
                alt="Messy desk"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzwYZPAs3thAzEa7NwVRNLuVMjbl4vHsaU9ZbvixGPkbTmvLrJwMXwD19Pgt4x1pAysWOzvS3ZJz7hn8axtfr8XODugIGcOUob7AFdMYFFvBZpmwF0dL6PaeUeRk_gqwNKR0QwvskH0rbd9wJWLwZ1fSicPVBsLpvqC1s1Uw_Wtj7w3hcq-5WFfXhlh1489fuo24sAPYAtRm5F6u_UZmGZb7cTDuB_fqz9hKxoD0wNc3zQYMb8SQT3Cf-cxkhKN-IFLt7LrNf87H25"
              />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
              <h2 className="text-3xl md:text-5xl font-light tracking-widest uppercase mb-8">
                "Không phải lúc nào cũng tiến về phía trước."
              </h2>
              <p className="text-gray-400 text-lg md:w-2/3 mx-auto">
                Có những ngày hệ thống sụp đổ. Có những ngày chúng tôi muốn bỏ cuộc. Nhưng chính
                những vết sẹo đó đã tạo nên FoodHub mạnh mẽ của ngày hôm nay.
              </p>
            </div>
          </section>

          <section className="py-24 bg-white text-black" data-purpose="vision-section" id="vision">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-extrabold mb-8">FoodHub vẫn đang tiếp tục.</h2>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <h4 className="font-bold text-lg">AI Predictions</h4>
                        <p className="text-gray-600">
                          Dự đoán doanh thu và hành vi khách hàng bằng trí tuệ nhân tạo.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <h4 className="font-bold text-lg">Smarter Operations</h4>
                        <p className="text-gray-600">
                          Tự động hóa quy trình đặt hàng nhà cung cấp khi kho sắp hết.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary mt-3 mr-4 flex-shrink-0"></span>
                      <div>
                        <h4 className="font-bold text-lg">SEA Expansion</h4>
                        <p className="text-gray-600">
                          Mang giải pháp quản lý Việt Nam vươn tầm Đông Nam Á.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <img
                    alt="Sunrise city"
                    className="rounded-2xl shadow-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4VnRnGTolI9M_7OMH9s339R7EHza_xUp_skbtiSHS52h8qvGZ8kMl9bG_9R8N3ZiP5ILEiI9rwoX2x0PC7TnhdA5XwSBRe9KdWaNkUAXc_JhJV5k6ZJ5XXTPd53ul2bgNV1pahaqqvCwx6YNmuag7GMIAvfiCwo6FvmARbDcbN2f638Sg-F_weI28GT372w6mzjDo2eIwbh4ByxPUiCWHn0eVUhvBBZt0uLev5ueXDoWGZvZ0tu3lY4gq3PaUAhPc28IJqvN1JmkY"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 hidden md:block">
                    <p className="text-4xl font-black">2025</p>
                    <p className="text-xs uppercase tracking-widest font-bold">
                      Lộ trình tương lai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-black overflow-hidden" data-purpose="peak-hour-chaos">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-primary font-mono text-xl">18:30</span>
                    <p className="text-gray-400">— Khách bắt đầu vào đông</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-primary font-mono text-xl">19:00</span>
                    <p className="text-gray-400">— Tất cả bàn đều kín</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-primary font-mono text-xl">19:10</span>
                    <p className="text-white font-bold">— Mọi thứ bắt đầu lệch khỏi quỹ đạo</p>
                  </div>
                </div>
                <div className="space-y-2 border-l border-primary/30 pl-6 py-2">
                  <p className="text-gray-500 line-through decoration-primary">Orders delayed</p>
                  <p className="text-gray-500 line-through decoration-primary">
                    Wrong dishes served
                  </p>
                  <p className="text-gray-500 line-through decoration-primary">Staff overwhelmed</p>
                </div>
                <h2 className="text-4xl font-black text-white leading-tight">
                  Tất cả chỉ diễn ra trong <span className="text-primary italic">30 phút.</span>
                </h2>
                <blockquote className="text-2xl italic font-light text-gray-300 border-l-4 border-primary pl-6">
                  "Vấn đề không nằm ở con người — mà là hệ thống."
                </blockquote>
                <div className="pt-8 flex items-center space-x-6">
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                    Và đó là lý do FoodHub tồn tại.
                  </p>
                  <button className="text-xs font-black uppercase tracking-tighter bg-primary px-4 py-2 hover:bg-neutral-800 transition">
                    Xem cách FoodHub giải quyết
                  </button>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 kitchen-overlay z-10 transition group-hover:opacity-0 duration-700"></div>
                <img
                  alt="Kitchen chaos blurred"
                  className="w-full h-[600px] object-cover grayscale transition duration-700 group-hover:grayscale-0"
                  src="https://images.unsplash.com/photo-1663790776790-680c6282da2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
                <div className="absolute bottom-0 right-0 p-8 text-right z-20">
                  <div className="w-20 h-1 bg-primary mb-4 ml-auto"></div>
                  <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/50">
                    Peak Hour Visualization
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 bg-[#1a1a1a]" data-purpose="tech-survival">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
              <div className="order-2 md:order-1 relative">
                <img
                  alt="Hands using POS tablet"
                  className="rounded-lg shadow-2xl opacity-80 border border-white/5 grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgA9ICs8wFLDCysapTv5WZz9Q2aBLMcU_3EvnvOuQ8FqMvPPzWhbMNWJeem9ZwdoIr8MHpVwrGWy0133SJnWn0oB2TyHa4qEYt0n_M5yD2e6uJWKpLhNwBiwZMmxHOXMbI5yF1lliFb4tgSueqk0Hg_Mih9C-BIfwYXDoSkt4O6392ZQg8Emrezq0nMwTuYzkH-zS0O6tKvroVgC1XAIFR1UbKCrt6vNx2d6znlmSW682WrF_XmwNtmVDIjL2fNQbMOgmaRNU-jhKZ"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div>
                  <span className="text-primary font-bold uppercase tracking-widest text-xs">
                    Đối đầu thực tại
                  </span>
                  <h2 className="text-4xl font-extrabold mt-4 mb-6 leading-tight">
                    Trong nhiều năm, giải pháp của nhà hàng là:{" "}
                    <span className="text-primary italic">thuê thêm người.</span>
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-400">
                      <svg
                        className="h-5 w-5 mr-3 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"></path>
                      </svg>
                      Sai sót vẫn xảy ra
                    </li>
                    <li className="flex items-center text-gray-400">
                      <svg
                        className="h-5 w-5 mr-3 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"></path>
                      </svg>
                      Giao tiếp vẫn lệch
                    </li>
                    <li className="flex items-center text-gray-400">
                      <svg
                        className="h-5 w-5 mr-3 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"></path>
                      </svg>
                      Vận hành vẫn rối
                    </li>
                  </ul>
                </div>
                <div className="py-6 border-y border-white/5">
                  <p className="text-xl font-bold text-white mb-2">
                    Thêm người không giải quyết được vấn đề hệ thống.
                  </p>
                  <p className="text-3xl md:text-5xl font-black tracking-tighter text-primary">
                    Công nghệ không phải để trông hiện đại. Nó là để tồn tại.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 py-2 border-b border-white/10">
                    Real-time sync
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 py-2 border-b border-white/10">
                    Table tracking
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 py-2 border-b border-white/10">
                    Stock visibility
                  </div>
                </div>
                <p className="text-sm italic text-gray-500 pt-4">
                  "Khách không nhìn thấy hệ thống. Nhưng họ luôn cảm nhận được nó."
                </p>
              </div>
            </div>
          </section>

          <section className="py-24 bg-primary" data-purpose="cta-section" id="cta">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                Bạn không chỉ sử dụng một hệ thống.
                <br />
                Bạn đang trở thành một phần của hành trình.
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <button className="bg-black text-white px-10 py-5 font-bold hover:bg-gray-900 transition-all uppercase tracking-widest">
                  Trải nghiệm FoodHub
                </button>
                <button className="border-2 border-white text-white px-10 py-5 font-bold hover:bg-white hover:text-primary transition-all uppercase tracking-widest">
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    );
  }

  // Fallback for other news IDs
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] pt-20">
        <h1 className="text-3xl font-bold mb-4">Nội dung đang được cập nhật</h1>
        <p className="text-muted-foreground">
          Bạn đang xem trang tin tức/landing có ID:{" "}
          <span className="font-mono text-primary">{params.newsid}</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
