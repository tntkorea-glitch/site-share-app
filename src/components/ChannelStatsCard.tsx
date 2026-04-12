"use client";

import { YouTubeChannel } from "@/lib/types";
import MonetizationBadge from "./MonetizationBadge";

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "만";
  if (n >= 1000) return (n / 1000).toFixed(1) + "천";
  return n.toLocaleString();
}

export default function ChannelStatsCard({
  channel,
  onSelect,
}: {
  channel: YouTubeChannel;
  onSelect: (ch: YouTubeChannel) => void;
}) {
  const m = channel.monetization;

  return (
    <div
      onClick={() => onSelect(channel)}
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* 채널 헤더 */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <img
          src={channel.thumbnailUrl}
          alt={channel.title}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">
            {channel.title}
          </h3>
          <MonetizationBadge monetization={m} />
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 border-t border-gray-100 px-4 py-3 text-center">
        <div>
          <p className="text-lg font-bold text-gray-900">
            {formatNumber(channel.subscriberCount)}
          </p>
          <p className="text-xs text-gray-500">구독자</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            {formatNumber(channel.viewCount)}
          </p>
          <p className="text-xs text-gray-500">총 조회수</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">
            {channel.videoCount}
          </p>
          <p className="text-xs text-gray-500">영상 수</p>
        </div>
      </div>

      {/* 수익화 진행률 */}
      <div className="space-y-2 border-t border-gray-100 px-4 py-3">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-500">
              구독자 {formatNumber(m.subscriberCount)} / 1,000
            </span>
            <span
              className={
                m.subscribersMet
                  ? "font-medium text-green-600"
                  : "text-gray-400"
              }
            >
              {m.subscriberProgress}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                m.subscribersMet ? "bg-green-500" : "bg-red-400"
              }`}
              style={{ width: `${m.subscriberProgress}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-500">
              시청시간 {formatNumber(m.estimatedWatchHours)}h / 4,000h
            </span>
            <span
              className={
                m.watchHoursMet
                  ? "font-medium text-green-600"
                  : "text-gray-400"
              }
            >
              {m.watchHoursProgress}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                m.watchHoursMet ? "bg-green-500" : "bg-orange-400"
              }`}
              style={{ width: `${m.watchHoursProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
