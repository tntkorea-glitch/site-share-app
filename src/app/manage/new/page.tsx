"use client";

import { useRouter } from "next/navigation";
import { addChannel } from "@/lib/storage";
import { getChannels } from "@/lib/storage";
import { ensureUniqueSlug } from "@/lib/slug";
import ChannelForm from "@/components/ChannelForm";

export default function NewChannelPage() {
  const router = useRouter();

  function handleSubmit(data: {
    name: string;
    slug: string;
    youtubeUrl: string;
    description: string;
    thumbnailUrl: string;
  }) {
    const slug = ensureUniqueSlug(data.slug, getChannels());
    addChannel({ ...data, slug });
    router.push("/manage");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
        새 채널 추가
      </h1>
      <ChannelForm onSubmit={handleSubmit} />
    </div>
  );
}
