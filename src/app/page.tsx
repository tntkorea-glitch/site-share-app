"use client";

import { useEffect, useState } from "react";
import { Channel } from "@/lib/types";
import { getChannels } from "@/lib/storage";
import ChannelCard from "@/components/ChannelCard";
import EmptyState from "@/components/EmptyState";

export default function Dashboard() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChannels(getChannels());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 유튜브 채널</h1>
        <p className="mt-1 text-sm text-gray-500">
          {channels.length}개의 채널을 관리 중입니다
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
