"use client";

import { useState } from "react";
import { Channel } from "@/lib/types";

export default function ShareEmbed({ channel }: { channel: Channel }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/channel/${channel.slug}`
      : `/channel/${channel.slug}`;

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;

  async function copy(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="font-semibold text-gray-900">공유 & 임베드</h3>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          공유 링크
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          />
          <button
            onClick={() => copy(shareUrl, "url")}
            className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            {copiedField === "url" ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          임베드 코드
        </label>
        <div className="flex gap-2">
          <textarea
            readOnly
            value={embedCode}
            rows={3}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-xs text-gray-700"
          />
          <button
            onClick={() => copy(embedCode, "embed")}
            className="shrink-0 self-start rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            {copiedField === "embed" ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
