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
