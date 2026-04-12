"use client";

import { useState } from "react";
import { Channel } from "@/lib/types";
import { slugify } from "@/lib/slug";

interface ChannelFormProps {
  initialData?: Channel;
  onSubmit: (data: {
    name: string;
    slug: string;
    youtubeUrl: string;
    description: string;
    thumbnailUrl: string;
  }) => void;
}

export default function ChannelForm({ initialData, onSubmit }: ChannelFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl ?? "");

  const slug = slugify(name);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !youtubeUrl.trim()) return;
    onSubmit({ name: name.trim(), slug, youtubeUrl: youtubeUrl.trim(), description: description.trim(), thumbnailUrl: thumbnailUrl.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          채널 이름 *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 테크 리뷰"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          required
        />
        {slug && (
          <p className="mt-1 text-xs text-gray-400">
            URL: /channel/<span className="font-medium text-gray-600">{slug}</span>
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          YouTube 채널 URL *
        </label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/@channelname"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="채널에 대한 간단한 설명"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          썸네일 이미지 URL
        </label>
        <input
          type="url"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/thumbnail.jpg"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="미리보기"
            className="mt-2 h-32 w-full rounded-lg object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
      >
        {initialData ? "채널 수정" : "채널 추가"}
      </button>
    </form>
  );
}
