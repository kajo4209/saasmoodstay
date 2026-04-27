export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg,#4FC3F7,#0288D1)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C10 4 8 6 9 9H15C16 6 14 4 12 2Z" fill="white" opacity="0.9" />
          <path d="M12 9L11 19H13L12 9Z" fill="white" />
          <path d="M9 9C7 7 4 8 3 10C5 10 7 9 9 9Z" fill="white" opacity="0.8" />
          <path d="M15 9C17 7 20 8 21 10C19 10 17 9 15 9Z" fill="white" opacity="0.8" />
          <path
            d="M3 21C5 19 7 20 9 21C11 19 13 20 15 21C17 19 19 20 21 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <span className="text-2xl font-black tracking-tight">
        <em
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          Mood
        </em>
        stay
      </span>
    </div>
  );
}
