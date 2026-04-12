"use client";

import { deleteChannel } from "@/lib/storage";

interface DeleteButtonProps {
  channelId: string;
  onDelete: () => void;
}

export default function DeleteButton({ channelId, onDelete }: DeleteButtonProps) {
  function handleDelete() {
    if (!confirm("정말 이 채널을 삭제하시겠습니까?")) return;
    deleteChannel(channelId);
    onDelete();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
    >
      삭제
    </button>
  );
}
