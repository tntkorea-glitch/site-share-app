import { YouTubeChannel, ChannelStats, STATS_STORAGE_KEY } from "./types";

const ACCOUNTS_KEY = "site-share-accounts";

export interface ConnectedAccount {
  email: string;
  name: string;
  image: string;
  connectedAt: string;
  channels: YouTubeChannel[];
}

export function getAccounts(): ConnectedAccount[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveAccount(
  email: string,
  name: string,
  image: string,
  channels: YouTubeChannel[]
): ConnectedAccount[] {
  const accounts = getAccounts();
  const existing = accounts.findIndex((a) => a.email === email);

  const account: ConnectedAccount = {
    email,
    name,
    image,
    connectedAt: new Date().toISOString(),
    channels,
  };

  if (existing >= 0) {
    accounts[existing] = account;
  } else {
    accounts.push(account);
  }

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return accounts;
}

export function removeAccount(email: string): ConnectedAccount[] {
  const accounts = getAccounts().filter((a) => a.email !== email);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return accounts;
}

export function getAllChannels(): YouTubeChannel[] {
  return getAccounts().flatMap((a) => a.channels);
}

// ── 일별 통계 스냅샷 ──

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getStatsHistory(): ChannelStats[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STATS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** 오늘 날짜로 각 채널의 스냅샷을 저장 (같은 날이면 덮어쓰기) */
export function saveStatsSnapshot(channels: YouTubeChannel[]): ChannelStats[] {
  const history = getStatsHistory();
  const date = todayStr();

  for (const ch of channels) {
    const idx = history.findIndex(
      (s) => s.channelId === ch.id && s.date === date
    );
    const snap: ChannelStats = {
      channelId: ch.id,
      date,
      subscriberCount: ch.subscriberCount,
      viewCount: ch.viewCount,
      videoCount: ch.videoCount,
    };
    if (idx >= 0) {
      history[idx] = snap;
    } else {
      history.push(snap);
    }
  }

  // 최대 90일분만 보관
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const trimmed = history.filter((s) => s.date >= cutoffStr);

  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

/** 특정 채널의 최근 N일 통계 */
export function getChannelStatsHistory(
  channelId: string,
  days = 30
): ChannelStats[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return getStatsHistory()
    .filter((s) => s.channelId === channelId && s.date >= cutoffStr)
    .sort((a, b) => a.date.localeCompare(b.date));
}
