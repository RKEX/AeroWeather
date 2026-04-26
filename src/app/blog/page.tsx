import React from "react";
import { BLOG_POSTS } from "@/lib/blog-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import { Metadata } from "next";
import { BlogListing } from "@/components/blog/blog-listing";
import { SubscribeForm } from "@/components/blog/subscribe-form";
import GlassCard from "@/components/ui/GlassCard";

export const metadata: Metadata = generateMetadataFromConfig({
  title: "Weather Intelligence Blog",
  description: "Explore in-depth articles about meteorology, air quality, climate science, and how to stay ahead of the weather with AeroWeather.",
  pathname: "/blog",
});

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20">
      <header className="mb-20 text-center">
        <GlassCard className="mb-6 inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 border-indigo-500/20 shadow-none">
          Atmospheric Intelligence
        </GlassCard>
        <h1 className="mb-6 text-5xl font-black tracking-tight text-white md:text-7xl">
          Meteorological <span className="text-indigo-400">Insights</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/50">
          Bridging the gap between complex climate science and daily human life. Join us as we explore the dynamic patterns of our atmosphere.
        </p>
      </header>

      <BlogListing posts={BLOG_POSTS} />
      
      <GlassCard className="mt-40 relative isolate overflow-hidden rounded-[3rem] p-8 md:p-20">
        <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
        
        <div className="relative z-10 text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">Subscribe to Insights</h2>
          <p className="mx-auto mb-12 max-w-xl text-lg text-white/50">
            Get technical weather breakdowns and platform updates delivered straight to your inbox. No noise, just data.
          </p>
          <SubscribeForm />
        </div>
      </GlassCard>
    </main>
  );
}
