export function OurStoryStyles() {
  return (
    <style
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
            background:
              linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(204,0,0,0.6)),
              url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop');
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
  );
}
