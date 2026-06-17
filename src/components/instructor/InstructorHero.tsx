import Image from "next/image";
import type { Instructor } from "@/lib/workshops";
import { FollowButton } from "./FollowButton";

const DEFAULT_LINE_OA = "https://line.me/R/ti/p/@016mxqyl";

export function InstructorHero({ instructor }: { instructor: Instructor }) {
  const lineUrl = instructor.lineOaUrl || DEFAULT_LINE_OA;
  return (
    <header className="mx-auto max-w-3xl px-4 pt-12 text-center sm:pt-16">
      {instructor.avatar && (
        <Image
          src={instructor.avatar}
          alt={instructor.name}
          width={112}
          height={112}
          className="mx-auto h-28 w-28 rounded-full object-cover"
        />
      )}
      <h1 className="mt-5 text-3xl font-bold text-stone-900">{instructor.name}</h1>
      <p className="mt-1 text-base text-stone-500">{instructor.title}</p>
      {instructor.bio && (
        <p className="mx-auto mt-4 max-w-xl text-lg text-stone-700">{instructor.bio}</p>
      )}
      {instructor.longBio && (
        <p className="mx-auto mt-3 max-w-xl whitespace-pre-line text-sm leading-relaxed text-stone-600">
          {instructor.longBio}
        </p>
      )}
      {instructor.links && instructor.links.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {instructor.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {l.label}
            </a>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-col items-center gap-3">
        {instructor.slug && (
          <FollowButton instructorSlug={instructor.slug} instructorName={instructor.name} />
        )}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[#06C755] px-4 py-2 text-sm font-medium text-[#06C755] hover:bg-[#06C755]/5"
        >
          加 LINE 領取上課資訊
        </a>
      </div>
    </header>
  );
}
