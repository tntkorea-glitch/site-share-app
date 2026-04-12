import Link from "next/link";
import { Channel } from "@/lib/types";

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link href={`/channel/${channel.slug}`}>
      <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          {channel.thumbnailUrl ? (
            <img
              src={channel.thumbnailUrl}
              alt={channel.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-gray-300">
              📺
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-red-500">
            {channel.name}
          </h3>
          {channel.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {channel.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            /{channel.slug}
          </p>
        </div>
      </div>
    </Link>
  );
}
