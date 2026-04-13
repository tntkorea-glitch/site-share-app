"use client";

import { useState, useEffect } from "react";
import { YouTubeChannel, YouTubeVideo, ChannelStats } from "@/lib/types";
import { getChannelStatsHistory } from "@/lib/account-storage";
import MonetizationBadge from "./MonetizationBadge";

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "만";
  if (n >= 1000) return (n / 1000).toFixed(1) + "천";
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

export default function ChannelDetail({
  channel,
  onClose,
}: {
  channel: YouTubeChannel;
  onClose: () => void;
}) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsHistory, setStatsHistory] = useState<ChannelStats[]>([]);

  useEffect(() => {
    fetch(`/api/youtube/videos?channelId=${channel.id}`)
      .then((r) => r.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));

    setStatsHistory(getChannelStatsHistory(channel.id, 30));
  }, [channel.id]);

  const m = channel.monetization;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-start gap-4 border-b border-gray-100 p-6">
          <img
            src={channel.thumbnailUrl}
            alt={channel.title}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {channel.title}
              </h2>
              <MonetizationBadge monetization={m} />
            </div>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {channel.description || "설명 없음"}
            </p>
            <a
              href={`https://studio.youtube.com/channel/${channel.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-red-500 hover:underline"
            >
              YouTube Studio 열기 →
            </a>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 통계 그리드 */}
        <div className="grid grid-cols-4 gap-4 border-b border-gray-100 p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(channel.subscriberCount)}
            </p>
            <p className="text-xs text-gray-500">구독자</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(channel.viewCount)}
            </p>
            <p className="text-xs text-gray-500">총 조회수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {channel.videoCount}
            </p>
            <p className="text-xs text-gray-500">영상 수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(m.estimatedWatchHours)}h
            </p>
            <p className="text-xs text-gray-500">추정 시청시간</p>
          </div>
        </div>

        {/* 수익화 상세 */}
        <div className="space-y-3 border-b border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            수익화 진행률
          </h3>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600">구독자</span>
              <span className={m.subscribersMet ? "font-medium text-green-600" : "text-red-500"}>
                {formatNumber(m.subscriberCount)} / 1,000명
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${m.subscribersMet ? "bg-green-500" : "bg-red-400"}`}
                style={{ width: `${m.subscriberProgress}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600">시청시간 (12개월)</span>
              <span className={m.watchHoursMet ? "font-medium text-green-600" : "text-orange-500"}>
                {formatNumber(m.estimatedWatchHours)}h / 4,000h
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${m.watchHoursMet ? "bg-green-500" : "bg-orange-400"}`}
                style={{ width: `${m.watchHoursProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 최근 영상 */}
        <div className="p-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            최근 영상
          </h3>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-400">
              영상 로딩 중...
            </div>
          ) : videos.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              영상이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {videos.map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-lg p-2 hover:bg-gray-50"
                >
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="h-16 w-28 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {v.title}
                    </p>
                    <div className="mt-1 flex gap-3 text-xs text-gray-500">
                      <span>조회수 {formatNumber(v.viewCount)}</span>
                      <span>좋아요 {formatNumber(v.likeCount)}</span>
                      <span>{timeAgo(v.publishedAt)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
