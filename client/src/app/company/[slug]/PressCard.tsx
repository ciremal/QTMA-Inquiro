import { Article } from "@/app/api/models";
import Link from "next/link";

interface PressCardProps {
  article: Article;
}

export default function PressCard({ article }: PressCardProps) {
  const { datetime, headline, image, summary, url } = article;
  const date = new Date(datetime * 1000).toLocaleDateString();
  const thumbnail = image
    ? image
    : "https://upload.wikimedia.org/wikipedia/commons/8/8f/Yahoo%21_Finance_logo_2021.png";
  return (
    <div className="flex-shrink-0 basis-[calc(33.333%-1rem)] border rounded-lg shadow-lg">
      <img
        src={thumbnail}
        alt="thumbnail"
        className="rounded-t-lg object-cover object-center w-full aspect-[16/9] mb-4"
      />
      <div className="p-4">
        <div className="flex justify-between text-sm">
          <p className="text-slate-500">{date}</p>
          <p className="text-red-500">STORY</p>
        </div>
        <h1 className="font-bold overflow-ellipsis line-clamp-2 break-words">
          {headline}
        </h1>
        <p className="text-xs text-slate-500 overflow-ellipsis line-clamp-4 break-words h-16">
          {summary}
        </p>
        <Link
          href={url}
          className="block text-right text-cyan-600 mt-8 hover:underline"
          target="_blank"
        >
          Read More
          <img src="/arrow.svg" alt="arrow" className="inline ml-2" />
        </Link>
      </div>
    </div>
  );
}
