"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { YouTubeChannel } from "@/lib/types";
import ChannelStatsCard from "@/components/ChannelStatsCard";
import ChannelDetail from "@/components/ChannelDetail";

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "만";
  if (n >= 1000) return (n / 1000).toFixed(1) + "천";
  return n.toLocaleString();
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] =
    useState<YouTubeChannel | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/youtube/channels");
      if (!res.ok) throw new Error("채널 정보를 가져올 수 없습니다");
      const data = await res.json();
      setChannels(data.channels || []);
      setLastUpdated(new Date().toLocaleString("ko-KR"));

      // localStorage에 스냅샷 저장 (일별 추적용)
      const today = new Date().toISOString().split("T")[0];
      const statsKey = `site-share-stats-${today}`;
      localStorage.setItem(
        statsKey,
        JSON.stringify(
          (data.channels || []).map((ch: YouTubeChannel) => ({
            channelId: ch.id,
            date: today,
            subscriberCount: ch.subscriberCount,
            viewCount: ch.viewCount,
            videoCount: ch.videoCount,
          }))
        )
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchChannels();
  }, [session, fetchChannels]);

  // 로그인 안 된 상태
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="text-6xl">📺</div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          유튜브 채널 대시보드
        </h1>
        <p className="mt-3 max-w-md text-gray-500">
          Google 계정으로 로그인하면 내 유튜브 채널의 구독자, 조회수, 시청시간,
          수익화 진행률을 한눈에 확인할 수 있습니다.
        </p>
        <button
          onClick={() => signIn("google")}
          className="mt-8 flex items-center gap-2 rounded-xl bg-white border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google 로그인으로 시작하기
        </button>
        <p className="mt-4 text-xs text-gray-400">
          YouTube 읽기 전용 권한만 요청합니다 (데이터 수정 불가)
        </p>
      </div>
    );
  }

  // 요약 통계
  const totalSubs = channels.reduce((s, c) => s + c.subscriberCount, 0);
  const totalViews = channels.reduce((s, c) => s + c.viewCount, 0);
  const totalVideos = channels.reduce((s, c) => s + c.videoCount, 0);
  const monetizable = channels.filter(
    (c) => c.monetization.subscribersMet && c.monetization.watchHoursMet
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* 상단 요약 */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">채널 대시보드</h1>
          {lastUpdated && (
            <p className="mt-1 text-xs text-gray-400">
              마지막 업데이트: {lastUpdated}
            </p>
          )}
        </div>
        <button
          onClick={fetchChannels}
          disabled={loading}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "업데이트 중..." : "새로고침"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 전체 통계 요약 */}
      {channels.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{channels.length}</p>
            <p className="text-sm text-gray-500">총 채널</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(totalSubs)}
            </p>
            <p className="text-sm text-gray-500">총 구독자</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(totalViews)}
            </p>
            <p className="text-sm text-gray-500">총 조회수</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {monetizable} / {channels.length}
            </p>
            <p className="text-sm text-gray-500">수익화 가능</p>
          </div>
        </div>
      )}

      {/* 채널 카드 그리드 */}
      {loading && channels.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="text-gray-400">채널 정보를 가져오는 중...</div>
        </div>
      ) : channels.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
          <p className="text-gray-500">
            이 계정에 연결된 YouTube 채널이 없습니다
          </p>
          <p className="mt-2 text-sm text-gray-400">
            다른 Google 계정으로 로그인해보세요
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch) => (
            <ChannelStatsCard
              key={ch.id}
              channel={ch}
              onSelect={setSelectedChannel}
            />
          ))}
        </div>
      )}

      {/* 채널 상세 모달 */}
      {selectedChannel && (
        <ChannelDetail
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
}
