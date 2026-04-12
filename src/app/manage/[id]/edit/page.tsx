"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Channel } from "@/lib/types";
import { getChannelById, getChannels, updateChannel } from "@/lib/storage";
import { ensureUniqueSlug } from "@/lib/slug";
import ChannelForm from "@/components/ChannelForm";
import Link from "next/link";

export default function EditChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setChannel(getChannelById(id));
    setLoaded(true);
  }, [id]);

  function handleSubmit(data: {
    name: string;
    slug: string;
    youtubeUrl: string;
    description: string;
    thumbnailUrl: string;
  }) {
    const slug = ensureUniqueSlug(data.slug, getChannels(), id);
    updateChannel(id, { ...data, slug });
    router.push("/manage");
  }

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <p className="text-gray-500">채널을 찾을 수 없습니다</p>
        <Link
          href="/manage"
          className="mt-4 text-sm text-red-500 hover:text-red-600"
        >
          관리 페이지로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
        채널 수정
      </h1>
      <ChannelForm initialData={channel} onSubmit={handleSubmit} />
    </div>
  );
}
