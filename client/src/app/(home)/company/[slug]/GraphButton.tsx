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
      className={`border border-primaryGray px-4 py-2 rounded-3xl text-xs font-semibold text-white hover:bg-primaryGray transition-all
            ${on ? "bg-primaryGray" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
