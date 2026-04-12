import { Channel, STORAGE_KEY } from "./types";

function read(): Channel[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function write(channels: Channel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
}

export function getChannels(): Channel[] {
  return read().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getChannelBySlug(slug: string): Channel | null {
  return read().find((c) => c.slug === slug) ?? null;
}

export function getChannelById(id: string): Channel | null {
  return read().find((c) => c.id === id) ?? null;
}

export function addChannel(
  data: Omit<Channel, "id" | "createdAt">
): Channel {
  const channels = read();
  const channel: Channel = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  channels.push(channel);
  write(channels);
  return channel;
}

export function updateChannel(
  id: string,
  data: Partial<Omit<Channel, "id" | "createdAt">>
): Channel | null {
  const channels = read();
  const idx = channels.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  channels[idx] = { ...channels[idx], ...data };
  write(channels);
  return channels[idx];
}

export function deleteChannel(id: string): void {
  const channels = read().filter((c) => c.id !== id);
  write(channels);
}
