import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-12 text-slate-900">
      <h1 className="text-4xl font-bold">Next.js + MDX</h1>
      <p className="max-w-xl text-center text-lg leading-8">
        Your MDX route is available at <code className="rounded bg-slate-100 px-1 py-0.5">/blog</code>.
      </p>
      <Link
        href="/blog"
        className="rounded bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700"
      >
        Go to MDX blog
      </Link>
    </main>
  );
}
