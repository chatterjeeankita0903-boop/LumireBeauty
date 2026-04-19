export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-card border border-[var(--champagne)]/60 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
        <span className="w-2 h-2 rounded-full bg-[var(--burgundy)]/60 dot-pulse" />
        <span className="w-2 h-2 rounded-full bg-[var(--burgundy)]/60 dot-pulse" />
        <span className="w-2 h-2 rounded-full bg-[var(--burgundy)]/60 dot-pulse" />
      </div>
    </div>
  );
}
