/* eslint-disable react/jsx-no-literals */

const teamMembers = [
  {
    role: "Backend",
    caption: "Người fix bug lúc 3h sáng",
    alt: "Backend silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGr4bmM3bcyPU2c2BbInnYQWkUFLr01bzd_gPcvkrCgM5DDj8DOREQgVxGGY5oV4QBWqMd19SbidjtQnqfhZPIz2g_XeRzHxTFM0_rfcqLgilh1jcPEKNPzE5bEuwrflC_hmH8n6cxLJNMBGXmby-0rOm-HWP8D3vhZ0SuhPjYPnb-RpaqWK-nN0tEkKZ1nsE2lRSTYhKX5VR7RpmJgiicpq5xPfXxo_i_j8bw0GOscknknktWk5kCrIs4NllZYu6UqMgSfbajhwWz",
  },
  {
    role: "Frontend",
    caption: "Kiến trúc sư của sự trải nghiệm",
    alt: "Frontend silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvcjCE0sPacr7H3YpDiQv5rCV8Y8ZVln4nx32lYX6TS7BdkkTQeUiLh6fuFq5gUPaY8DtIdX2TpB0tBbnAkAhamTU9Qaz-ZCMK5Uwt0SaqtMz4SRyA-_p4lIYgel6x3zOa5x2gkwPEXbGyOunZiKGQ7gsh_Yc44BLC7rl-WUJDU_Mdv0CuJ02kTznzde4f4LaEAGaC4X-5tLWS5LZaaAF7bxakpnwL21YuKo5ek9vX-LMIGlG4GyFxbmk1qCTtVzkqfJfBgAV37oGA",
  },
  {
    role: "Product / BA",
    caption: "Kẻ mơ mộng thực tế",
    alt: "Product silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0WukNWxns9iUcSaLhi6ixzEO2RtUtGMwo6vGbhaSQyGXyvNIm5J8YOYaJ-R1bxZIougEfsKyvA2DmNX8IszDY-w0QAXHoZhp-x3URee5kLlj7-wzn8daqRJez0-4wrj5UWD-Z7S82m8Og_oQ2EYXnIaEk7hv2ovJ-lyJwXMfij-S2RwiBtXDFTJACEfJHtNoyLc2NVcLy8_jeDLBuemnsO1P-LxmdtOTOdLBm46Ggn7spfcMoIoQImceFw-8--oIZeVVt0vIUdk6S",
  },
  {
    role: "QA",
    caption: "Người tìm thấy lỗi trong sự hoàn hảo",
    alt: "QA silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7thQOfcLnxtu8iHwaEjQTcOjBf1xTysFmqNRp2GDfA_m-P-4V2LKCf-ak9YyAzujGj0EF31r1sl05122qTA7UHMt69vKcuHOl9utArEg39GlXarAl-Mr-RbdRijrQ96oL4_HZFFGx15442zrsdUrEsO2y-YUyKzfUt3QQE2TKjtwfeWmPJaGPmzg9RNlFZkqr03u8rkClmVFVMowAFvcMi6KH7XwXnTU19nkiERGDsBktqGuG5B2-NaU-3d1PUrakidW5nUICmobb",
  },
  {
    role: "Designer",
    caption: "Người thổi hồn vào những con số",
    alt: "Designer silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRZTSCUZEHRk7Rs9ZRSU-bjLaXhVB9IX7H8EXHHT0JjKlQYg7v3HSYIrsktzSVUAXHam3WVL7vytGP-8IQ-0_2SN3R9sB-dLSY2GZSwCOaoEqFK_psvaNVfQdFgSHWoLXTbhnaNyfSBpz0rUuRPsLGvFQuus3bTwVeIuPTRzdD5HE9jj1T2WgqVnM0zXRbJFSfQvgWzLwhVCxfbNarBvmOjIUXa5lxjA_TRsx8HixwvY9YBv1AvALiBSN3rCCcVVdBPZDs1NV8Dt35",
  },
  {
    role: "DevOps",
    caption: "Lá chắn cho sự ổn định",
    alt: "DevOps silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS5HRqHExuZ_7Fx4GSojqeo7B9oi3-pe9N8Fzd-f5PXHfSLVKqs0FGdWC6Z6YPvtetnzPNVmux63TDdNg9zun1ecXij6H-6lUdzLfTCtiDkyMpVJO_Ai0E5Pp_ylxs_DQHuzeq7lj55KDscq_NA3pos8EC-CxoWnH36nysQBbt7oZa6hel3dxC631QAiv9sDiUSQ2sDT7Vk6mzlcyHyOMOSiSl9Wx5kM-z36vdjvsbOHh2WPTUHRyFE5d-zhh4TjQH-YREL_11DLuV",
  },
  {
    role: "Pentester",
    caption: "Tuyến phòng thủ thầm lặng",
    alt: "Marketing silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhXAh7SSBYNv5T8oGsEz83fjXaYCRu6Zq4pDyxFpnPO0jfPSIAGzGhZfqAm8H4ZY7jdN3hDJZNTXjcYnbfs_y33ziTf9yKZmyqqrcrb_AhEzmhyhreL-GCG-WZqxqLLy6IV_Ie2YfLa19B4j1K1kLljP6mcb_h-iEELYyjG0zL0kXBwsbNTu5s5qbrb7av68ZyeG9dCfkLrPZquAF4pCGDz2XG37HIF2uF5JMUvQ84w1pB1sgnXuZqk_I2Uu-NfYL3DEjNCSQ8JcVO",
  },
  {
    role: "Support",
    caption: "Người bạn đồng hành tận tâm",
    alt: "Support silhouette",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjQTDygXiNZumJSC4T5ogwhbG1uLdZRBOylZtQkoyyKZWGiyxZ3CcZRuuNOIIha46NKe55HeUZcOdEkxJKYTEmZyqYfnbSS9dErwG3nKdmCaaDvPX89zw4SEqojDG3ykI4wS7i0pgALdbVoZq_iamOAar6PvD1NMnygUgNaxfgpmtIEMQDwt6CD_OnQzLI7YLEqQQUQ6qgrkjQNRHw-FA_EH1Q7UAlRuEoG73eITQEMiFyYfnu0OqBUxwH1oQ901cVaGGAp461YVxO",
  },
];

export function OurStoryTeamSection() {
  return (
    <section className="bg-[#121212] py-24" data-purpose="team-grid">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold italic tracking-tighter">
            NHỮNG CÁI BÓNG PHÍA SAU MÀN HÌNH
          </h2>
          <p className="mt-2 text-gray-500">8 con người, 1 sứ mệnh chung.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.role}
              className="group relative aspect-square overflow-hidden border border-white/5 bg-black"
            >
              <img
                alt={member.alt}
                className="h-full w-full object-cover opacity-30 grayscale transition duration-700 group-hover:opacity-60"
                src={member.src}
              />
              <div className="absolute bottom-4 left-4">
                <p className="text-sm font-bold text-primary">{member.role}</p>
                <p className="text-xs text-gray-400">{member.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
