/* eslint-disable react/jsx-no-literals */

export function OurStoryHeroSection() {
  return (
    <section
      className="relative flex h-screen items-center justify-center overflow-hidden hero-gradient"
      data-purpose="hero-section"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-4xl px-6 text-center animate-fade-in">
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          8 con người. <br /> 0 nguồn lực.
          <br />
          <span className="text-primary italic">1 hành trình không dễ dàng.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-300 md:text-xl">
          FoodHub được xây dựng từ những đêm trắng, những lần thất bại, và một niềm tin không ai
          nhìn thấy.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <div className="h-15 w-1 animate-bounce bg-primary opacity-50 [animation-delay:-0.3s]" />
          <div className="h-15 w-1 animate-bounce bg-primary opacity-50 [animation-delay:-0.15s]" />
          <div className="h-15 w-1 animate-bounce bg-primary opacity-50" />
        </div>
      </div>
    </section>
  );
}
