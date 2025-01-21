interface GraphButtonProps {
  children: string;
  on: boolean;
  onClick: () => void;
}

export default function GraphButton({
  children,
  on,
  onClick,
}: GraphButtonProps) {
  return (
    <button
      className={`border px-4 py-2 rounded-3xl font-bold text-xs hover:bg-slate-100 dark:hover:bg-primaryGray transition-all
            ${on ? "bg-slate-100 dark:bg-primaryGray" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
