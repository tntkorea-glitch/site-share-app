import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-900">
          📺 SiteShare
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              대시보드
            </Link>
            <Link
              href="/guide"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              수익화 가이드
            </Link>
            <Link
              href="/manage"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              수동 관리
            </Link>
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
