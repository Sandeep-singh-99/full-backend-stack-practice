"use client";

import BlogContent from "./post.mdx";

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-3xl rounded-3xl bg-white/90 p-10 shadow-lg shadow-slate-200">
        <BlogContent />
      </section>
    </main>
  );
}
