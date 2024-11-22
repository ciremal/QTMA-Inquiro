interface DescriptionProps {
  description: string;
}

export default function Description({ description }: DescriptionProps) {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-md px-12 py-8 basis-0 grow-[3] overflow-y-auto max-h-full no-scrollbar">
      <h1 className="font-bold text-xl mb-4">Company Description</h1>
      <p>{description}</p>
    </div>
  );
}
