"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Channel } from "@/lib/types";
import { getChannels } from "@/lib/storage";
import DeleteButton from "@/components/DeleteButton";

export default function ManagePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChannels(getChannels());
    setLoaded(true);
  }, []);

  function refresh() {
    setChannels(getChannels());
  }

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">채널 관리</h1>
        <Link
          href="/manage/new"
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          + 채널 추가
        </Link>
      </div>

      {channels.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          등록된 채널이 없습니다
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {channels.map((channel, i) => (
            <div
              key={channel.id}
              className={`flex items-center gap-4 px-5 py-4 ${
                i > 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {channel.thumbnailUrl ? (
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg text-gray-300">
                    📺
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{channel.name}</p>
                <p className="truncate text-xs text-gray-400">
                  /channel/{channel.slug}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/channel/${channel.slug}`}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  보기
                </Link>
                <Link
                  href={`/manage/${channel.id}/edit`}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  수정
                </Link>
                <DeleteButton channelId={channel.id} onDelete={refresh} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
