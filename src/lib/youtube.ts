import { YouTubeChannel, YouTubeVideo, MonetizationStatus } from "./types";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const ANALYTICS_BASE = "https://youtubeanalytics.googleapis.com/v2";

function calcMonetization(
  subscriberCount: number,
  watchHours: number
): MonetizationStatus {
  const subscriberProgress = Math.min(
    100,
    Math.round((subscriberCount / 1000) * 100)
  );
  const watchHoursProgress = Math.min(
    100,
    Math.round((watchHours / 4000) * 100)
  );

  return {
    subscribersMet: subscriberCount >= 1000,
    watchHoursMet: watchHours >= 4000,
    subscriberCount,
    estimatedWatchHours: watchHours,
    subscriberProgress,
    watchHoursProgress,
  };
}

/** YouTube Analytics API로 최근 365일 실제 시청시간(시간) 조회 */
export async function getWatchHours(
  accessToken: string,
  channelId: string
): Promise<number> {
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 365 * 86400000)
    .toISOString()
    .slice(0, 10);

  try {
    const res = await fetch(
      `${ANALYTICS_BASE}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=estimatedMinutesWatched`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!res.ok) return -1; // 실패 시 -1 반환 (폴백용)

    const data = await res.json();
    // rows: [[minutesWatched]]
    if (data.rows && data.rows.length > 0) {
      const minutes = data.rows[0][0] || 0;
      return Math.round(minutes / 60);
    }
    return 0;
  } catch {
    return -1;
  }
}

export async function getMyChannels(
  accessToken: string
): Promise<YouTubeChannel[]> {
  // 현재 계정의 모든 채널 가져오기
  const res = await fetch(
    `${API_BASE}/channels?part=snippet,statistics,contentDetails&mine=true&maxResults=50`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) return [];

  return data.items.map((item: any) => {
    const stats = item.statistics;
    const subscriberCount = parseInt(stats.subscriberCount || "0");
    const viewCount = parseInt(stats.viewCount || "0");
    const videoCount = parseInt(stats.videoCount || "0");

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl:
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url ||
        "",
      subscriberCount,
      viewCount,
      videoCount,
      publishedAt: item.snippet.publishedAt,
      monetization: calcMonetization(subscriberCount, viewCount, videoCount),
    } satisfies YouTubeChannel;
  });
}

export async function getChannelVideos(
  accessToken: string,
  channelId: string,
  maxResults = 10
): Promise<YouTubeVideo[]> {
  // 채널의 최신 영상 가져오기
  const searchRes = await fetch(
    `${API_BASE}/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) return [];
  const searchData = await searchRes.json();
  if (!searchData.items || searchData.items.length === 0) return [];

  const videoIds = searchData.items
    .map((item: any) => item.id.videoId)
    .join(",");

  const videosRes = await fetch(
    `${API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!videosRes.ok) return [];
  const videosData = await videosRes.json();

  return videosData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    publishedAt: item.snippet.publishedAt,
    viewCount: parseInt(item.statistics?.viewCount || "0"),
    likeCount: parseInt(item.statistics?.likeCount || "0"),
    duration: item.contentDetails?.duration || "",
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
  }));
}

// YouTube 채널 ID로 직접 조회 (외부 채널도 가능)
export async function getChannelById(
  accessToken: string,
  channelId: string
): Promise<YouTubeChannel | null> {
  const res = await fetch(
    `${API_BASE}/channels?part=snippet,statistics&id=${channelId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  if (!data.items || data.items.length === 0) return null;

  const item = data.items[0];
  const stats = item.statistics;
  const subscriberCount = parseInt(stats.subscriberCount || "0");
  const viewCount = parseInt(stats.viewCount || "0");
  const videoCount = parseInt(stats.videoCount || "0");

  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    subscriberCount,
    viewCount,
    videoCount,
    publishedAt: item.snippet.publishedAt,
    monetization: calcMonetization(subscriberCount, viewCount, videoCount),
  };
}
