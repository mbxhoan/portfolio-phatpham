import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg px-6 text-center">
      <p className="font-display text-[80px] font-extrabold leading-none text-navy">404</p>
      <h1 className="text-2xl font-bold text-ink">Không tìm thấy trang</h1>
      <p className="max-w-md text-body">Trang bạn tìm có thể đã được di chuyển hoặc không còn tồn tại.</p>
      <Link href="/" className="btn btn-lg btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
