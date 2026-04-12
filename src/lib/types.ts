// localStorage 채널 (수동 등록)
export interface Channel {
  id: string;
  name: string;
  slug: string;
  youtubeUrl: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
}

export const STORAGE_KEY = "site-share-channels";

// YouTube API 채널 데이터
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  publishedAt: string;
  // 수익화 관련
  monetization: MonetizationStatus;
}

export interface MonetizationStatus {
  subscribersMet: boolean;    // 구독자 1,000명 이상
  watchHoursMet: boolean;     // 시청시간 4,000시간 이상 (추정)
  subscriberCount: number;
  estimatedWatchHours: number;
  subscriberProgress: number; // 0~100%
  watchHoursProgress: number; // 0~100%
}

// YouTube 영상 데이터
export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  duration: string;
  channelId: string;
  channelTitle: string;
}

// 채널 통계 스냅샷 (일별 저장용)
export interface ChannelStats {
  channelId: string;
  date: string; // YYYY-MM-DD
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

export const STATS_STORAGE_KEY = "site-share-stats";
