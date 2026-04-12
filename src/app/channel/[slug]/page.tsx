"use client";

import { use, useEffect, useState } from "react";
import { Channel } from "@/lib/types";
import { getChannelBySlug } from "@/lib/storage";
import ShareEmbed from "@/components/ShareEmbed";
import Link from "next/link";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChannel(getChannelBySlug(slug));
    setLoaded(true);
  }, [slug]);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="text-5xl">😢</div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          채널을 찾을 수 없습니다
        </h2>
        <Link
          href="/"
          className="mt-4 text-sm text-red-500 hover:text-red-600"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Channel Header */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {channel.thumbnailUrl && (
          <div className="aspect-video w-full overflow-hidden bg-gray-100">
            <img
              src={channel.thumbnailUrl}
              alt={channel.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{channel.name}</h1>
          {channel.description && (
            <p className="mt-2 text-gray-600">{channel.description}</p>
          )}
          <a
            href={channel.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white hover:bg-red-600"
          >
            ▶ YouTube에서 보기
          </a>
        </div>
      </div>

      {/* Share & Embed */}
      <div className="mt-6">
        <ShareEmbed channel={channel} />
      </div>
    </div>
  );
}
