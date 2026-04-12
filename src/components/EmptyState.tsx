import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl">📺</div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        아직 등록된 채널이 없습니다
      </h2>
      <p className="mt-2 text-gray-500">
        유튜브 채널을 추가하고 공유 페이지를 만들어보세요
      </p>
      <Link
        href="/manage/new"
        className="mt-6 rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
      >
        첫 번째 채널 추가하기
      </Link>
    </div>
  );
}
