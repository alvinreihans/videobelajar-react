export default function Divider({ text }) {
  return (
    <div className="flex items-center w-full gap-4">
      <div className="flex-1 h-[1px] bg-border" />
      <span className="text-text-dark-secondary text-sm font-sans">{text}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}
