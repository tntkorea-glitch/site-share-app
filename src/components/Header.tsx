import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-900">
          📺 SiteShare
        </Link>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            대시보드
          </Link>
          <Link
            href="/manage"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            채널 관리
          </Link>
          <Link
            href="/manage/new"
            className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
          >
            + 채널 추가
          </Link>
        </nav>
      </div>
    </header>
  );
}
