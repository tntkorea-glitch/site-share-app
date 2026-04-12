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
