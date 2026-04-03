/* eslint-disable react/jsx-no-literals */

const productFeatures = [
  {
    title: "Quản lý bàn thông minh",
    description: "Sơ đồ bàn trực quan, tối ưu hóa không gian và thời gian phục vụ khách hàng.",
    iconPath: "M4 6h16M4 10h16M4 14h16M4 18h16",
  },
  {
    title: "Đồng bộ Order thời gian thực",
    description: "Không còn sai lệch giữa nhân viên phục vụ và bếp. Tốc độ là ưu tiên hàng đầu.",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Kiểm soát kho chặt chẽ",
    description: "Tự động trừ định mức nguyên liệu. Cảnh báo hết hàng trước khi quá muộn.",
    iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    title: "Tối ưu giờ cao điểm",
    description:
      "Sử dụng dữ liệu để dự báo và chuẩn bị, giúp nhà hàng vận hành mượt mà lúc đông nhất.",
    iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

export function OurStoryProductValueSection() {
  return (
    <section className="bg-white py-24 text-black" data-purpose="product-features" id="product">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-5xl leading-none font-black tracking-tighter">
              GIÁ TRỊ
              <br />
              <span className="text-primary">CỐT LÕI.</span>
            </h2>
            <p className="mb-8 text-gray-600">
              Chúng tôi không bán phần mềm. Chúng tôi bán sự an tâm cho nhà hàng của bạn.
            </p>

            <div className="border-l-4 border-primary bg-gray-50 p-6">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                Dashboard Preview
              </p>
              <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded bg-gray-200">
                <div className="h-full w-full space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-300" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 rounded bg-primary/20" />
                    <div className="h-10 rounded bg-primary/20" />
                    <div className="h-10 rounded bg-primary/20" />
                  </div>
                  <div className="h-4 w-1/2 rounded bg-gray-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:col-span-2">
            {productFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group border border-gray-100 p-8 transition hover:shadow-xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center bg-primary text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d={feature.iconPath}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
