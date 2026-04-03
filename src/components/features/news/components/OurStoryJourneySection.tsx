/* eslint-disable react/jsx-no-literals */

const milestones = [
  {
    title: "Bắt đầu từ con số 0",
    description: (
      <>
        Chỉ có ý tưởng và những chiếc laptop cũ. Không văn phòng, không đầu tư, không kỳ vọng. Chỉ
        có đam mê và sự quyết tâm.
      </>
    ),
    imageAlt: "Shadow of team",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Sj8M56b_ZV7gRmV3GbBw6atD7B5klFOy8Kggy3y-BObZPputtQvRhLOFDdENE2dBRxjTr6K7lolR8gyPoCDsJuqlHVOOO3nk8_N8PiNAwtafdb7SKcQ6ifaGqPqrqrCDIkYGD5fVec8J-zPGtfm9xqCPcfJ732iw2kg4omyYckxmPZSTp0X2g8RXenepBV3EphJj-6OaNA-g4dPyKLu6qOQC8eIImwdymYzwg_VLqWxhw3JLQrP1fF4nIJxcTdW4W2s5RCAW1_CX",
    reverse: false,
  },
  {
    title: "Những đêm 3 giờ sáng",
    description: (
      <>
        Có những đêm, ánh sáng duy nhất là từ màn hình laptop và những dòng code lỗi. Cà phê nguội
        đi. Thời gian trôi qua. Và áp lực thì không biến mất.
        <br />
        <br />
        Chúng tôi không chỉ viết code — chúng tôi học cách chịu đựng, học cách tiếp tục ngay cả khi
        không còn chắc chắn mình đang đi đúng hướng.
      </>
    ),
    imageAlt: "Hands typing",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAojMAh4aD5CoSinLWlEUfx-jAKyWLxZ4X05MbJJKFVlBfzodT9ha7UiqB5GOnHuBy6DKT2IQK-_KYOTzEPhnmP704SHiLWxIFtX-gZU1j1cPO67m3wwY0gKhEIP78Bm0trYkXMBZIxOQPiGgFuVb1qKa_aZH_9gojClprvmSLTgxLC_jCSm4np5t45Pl-bGdnbjcI5v4m7-HfMcx04JVmUygSOE2XYnZAA8cEcMEMFfQVnVZE0ncsxbDJ6eDi2yW5xvidFcpnT-2BY",
    reverse: true,
  },
  {
    title: "Dám đưa vào thực tế",
    description: (
      <>
        Không còn là bản demo. Không còn là ý tưởng. Lần đầu tiên, FoodHub được sử dụng trong một
        quán ăn thật.
        <br />
        <br />
        Chúng tôi đứng đó — không phải với sự tự tin, mà với sự hồi hộp đến nghẹt thở.
        <br />
        <br />
        Và khi đơn hàng đầu tiên chạy thành công, chúng tôi biết: đây không còn chỉ là một dự án.
      </>
    ),
    footerText: "Sau tất cả… đó là một giấc mơ",
    imageAlt: "Restaurant blur",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAd7GcvWYtzdH7U7KScm9Dg6U8wNmPuBRIhlgXRizuLnLo_hOH2V50_oGqAZrq2xoLZoXZv3yo3jlQden3z2xV_kMQD1rZheAbzvbrA92IkTYIfaANRDX75UTOv3dmHreaU6H3YCqxpuc4pGhk8miUl0G472oBczb_yF7f72cKQl6LcsT0AWRRi1NKamZ0srEjtOSowgitvKPiNXqxQoldl3PObHVOFt7-gBdzZiZslz0Om4tV-McWDjzxXWAi87tEX16JqSX3I3rN",
    reverse: false,
  },
];

export function OurStoryJourneySection() {
  return (
    <section className="relative bg-black py-24" data-purpose="journey-timeline" id="journey">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-extrabold">Cột mốc của sự kiên trì</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-primary" />
        </div>

        <div className="relative">
          <div className="timeline-line absolute left-1/2 hidden h-full -translate-x-1/2 transform md:block" />

          <div className="space-y-24">
            {milestones.map((milestone) => (
              <div
                key={milestone.title}
                className={`relative flex flex-col items-center justify-between ${
                  milestone.reverse ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div
                  className={`mb-8 md:mb-0 md:w-5/12 ${
                    milestone.reverse ? "text-center md:text-left" : "text-center md:text-right"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-primary">{milestone.title}</h3>
                  <p className="mt-2 text-gray-400">{milestone.description}</p>
                  {milestone.footerText ? <p className="mt-6">{milestone.footerText}</p> : null}
                </div>

                <div className="red-glow z-10 h-4 w-4 rounded-full bg-primary" />

                <div className="mt-8 md:mt-0 md:w-5/12">
                  <img
                    alt={milestone.imageAlt}
                    className="rounded-lg opacity-60 grayscale transition duration-500 hover:grayscale-0"
                    src={milestone.imageSrc}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
