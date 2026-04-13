"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { YouTubeChannel } from "@/lib/types";
import { getAllChannels } from "@/lib/account-storage";

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "만";
  if (n >= 1000) return (n / 1000).toFixed(1) + "천";
  return n.toLocaleString();
}

const YPP_REQUIREMENTS = [
  {
    title: "구독자 1,000명",
    description: "채널 구독자가 1,000명 이상이어야 합니다.",
    target: 1000,
    key: "subscribers" as const,
    icon: "👥",
  },
  {
    title: "시청시간 4,000시간",
    description:
      "최근 12개월 동안 공개 동영상의 시청시간이 4,000시간 이상이어야 합니다.",
    target: 4000,
    key: "watchHours" as const,
    icon: "⏱️",
  },
];

const TIPS = [
  {
    title: "꾸준한 업로드",
    description:
      "주 2~3회 이상 일정한 간격으로 영상을 업로드하세요. 알고리즘이 꾸준한 채널을 선호합니다.",
    icon: "📅",
  },
  {
    title: "검색 최적화 (SEO)",
    description:
      "제목, 설명, 태그에 검색 키워드를 넣으세요. 사람들이 실제로 검색하는 단어를 사용하는 것이 중요합니다.",
    icon: "🔍",
  },
  {
    title: "썸네일 & 제목",
    description:
      "클릭을 유도하는 매력적인 썸네일과 궁금증을 자극하는 제목이 조회수를 크게 좌우합니다.",
    icon: "🎨",
  },
  {
    title: "시청 지속률 높이기",
    description:
      "영상 초반 30초에 핵심 내용을 예고하고, 중간중간 시각적 변화를 줘서 이탈을 방지하세요.",
    icon: "📊",
  },
  {
    title: "커뮤니티 활용",
    description:
      "댓글에 답변하고, 커뮤니티 탭에 게시물을 올려 구독자와 소통하세요. 참여도가 높은 채널은 추천에 유리합니다.",
    icon: "💬",
  },
  {
    title: "Shorts 활용",
    description:
      "쇼츠로 새 시청자를 유입시키고, 본 채널 영상으로 유도하세요. 쇼츠 조회수도 시청시간에 기여합니다.",
    icon: "📱",
  },
];

const STEPS = [
  {
    step: 1,
    title: "YouTube 파트너 프로그램(YPP) 자격 충족",
    description: "구독자 1,000명 + 시청시간 4,000시간 달성",
  },
  {
    step: 2,
    title: "YPP 신청",
    description: "YouTube Studio > 수익 창출 메뉴에서 신청",
  },
  {
    step: 3,
    title: "Google AdSense 계정 연결",
    description: "수익금 수령을 위한 AdSense 계정 설정",
  },
  {
    step: 4,
    title: "채널 심사",
    description: "YouTube 정책 준수 여부 심사 (보통 1~4주 소요)",
  },
  {
    step: 5,
    title: "수익화 승인",
    description: "승인 후 광고 수익, 채널 멤버십, Super Chat 등 활성화",
  },
];

export default function GuidePage() {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);

  useEffect(() => {
    setChannels(getAllChannels());
  }, []);

  // 채널별 달성 현황
  const channelStatus = channels.map((ch) => {
    const m = ch.monetization;
    const bothMet = m.subscribersMet && m.watchHoursMet;
    const avgProgress = Math.round(
      (m.subscriberProgress + m.watchHoursProgress) / 2
    );
    return { ...ch, bothMet, avgProgress };
  });

  const sortedChannels = [...channelStatus].sort(
    (a, b) => b.avgProgress - a.avgProgress
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← 대시보드로 돌아가기
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          YouTube 수익화 가이드
        </h1>
        <p className="mt-2 text-gray-500">
          채널 수익화(YPP) 달성을 위한 조건, 절차, 그리고 실전 팁을 안내합니다.
        </p>
      </div>

      {/* 내 채널 달성 현황 */}
      {channels.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            내 채널 수익화 현황
          </h2>
          <div className="space-y-3">
            {sortedChannels.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <img
                  src={ch.thumbnailUrl}
                  alt={ch.title}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {ch.title}
                    </h3>
                    {ch.bothMet ? (
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        수익화 가능
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                        {ch.avgProgress}% 달성
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-4 text-xs text-gray-500">
                    <span>
                      구독자 {formatNumber(ch.subscriberCount)}/1,000{" "}
                      {ch.monetization.subscribersMet ? "✅" : "❌"}
                    </span>
                    <span>
                      시청시간 {formatNumber(ch.monetization.estimatedWatchHours)}
                      h/4,000h {ch.monetization.watchHoursMet ? "✅" : "❌"}
                    </span>
                  </div>
                </div>
                <div className="w-20 shrink-0">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        ch.bothMet ? "bg-green-500" : "bg-orange-400"
                      }`}
                      style={{ width: `${ch.avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* YPP 조건 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          수익화 조건 (YPP)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {YPP_REQUIREMENTS.map((req) => (
            <div
              key={req.key}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-2 text-3xl">{req.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{req.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>참고:</strong> 2023년부터 쇼츠 수익화 트랙이 추가되었습니다.
            구독자 1,000명 + 최근 90일 쇼츠 조회수 1,000만 회로도 YPP 신청이
            가능합니다.
          </p>
        </div>
      </section>

      {/* 수익화 절차 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          수익화 절차
        </h2>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 실전 팁 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          수익화 달성 실전 팁
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="mb-2 text-2xl">{tip.icon}</div>
              <h3 className="font-semibold text-gray-900">{tip.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 주의사항 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          주의사항
        </h2>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <ul className="space-y-2 text-sm text-red-800">
            <li>
              <strong>커뮤니티 가이드라인 준수:</strong> 저작권 경고 3회 누적 시
              채널이 삭제될 수 있습니다.
            </li>
            <li>
              <strong>반복 콘텐츠 금지:</strong> 동일하거나 유사한 영상을
              반복 업로드하면 심사에서 거부됩니다.
            </li>
            <li>
              <strong>재사용 콘텐츠:</strong> 다른 채널의 영상을 편집 없이
              재업로드하면 수익화가 거부됩니다.
            </li>
            <li>
              <strong>인위적 트래픽:</strong> 조회수/구독자 구매는 채널 정지 사유입니다.
            </li>
          </ul>
        </div>
      </section>

      {/* 유용한 링크 */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">유용한 링크</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://studio.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
          >
            <span className="text-2xl">🎬</span>
            <div>
              <p className="font-medium text-gray-900">YouTube Studio</p>
              <p className="text-xs text-gray-500">채널 관리 및 분석</p>
            </div>
          </a>
          <a
            href="https://www.youtube.com/intl/ko/creators/how-things-work/video-monetization/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
          >
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-medium text-gray-900">YouTube 수익 창출 안내</p>
              <p className="text-xs text-gray-500">공식 수익화 정보</p>
            </div>
          </a>
          <a
            href="https://support.google.com/youtube/answer/72851"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-gray-900">YPP 자격 요건</p>
              <p className="text-xs text-gray-500">공식 파트너 프로그램 안내</p>
            </div>
          </a>
          <a
            href="https://www.google.com/adsense"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
          >
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-medium text-gray-900">Google AdSense</p>
              <p className="text-xs text-gray-500">광고 수익 정산</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
