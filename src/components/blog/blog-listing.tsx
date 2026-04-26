"use client";

import { BlogPost } from "@/lib/blog-content";
import { Link } from "@/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Filter, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

interface Props {
  posts: BlogPost[];
}

const CATEGORIES = ["All", "AQI", "Forecast", "Radar", "Climate"];

export function BlogListing({ posts }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(6);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, displayCount);

  return (
    <div className="space-y-20">
      {/* Search & Filter Header */}
      <GlassCard className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between p-8 rounded-2xl">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search intelligence database..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-16 pr-6 text-lg text-white outline-none transition-all focus:bg-white/10 placeholder:text-white/20 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-white text-slate-900 scale-105"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Results Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visiblePosts.map((post, idx) => {
              const readTime = Math.ceil(post.content.split(/\s+/).length / 200) + 1;
              const postImage = post.image || "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80";

              return (
                <motion.div
                  layout
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                >
                  <GlassCard 
                    className="group relative flex h-full flex-col overflow-hidden p-8 transition-all duration-700 hover:bg-white/10"
                  >
                    <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" />

                    
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="relative mb-8 h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                        <img
                          src={postImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== "/fallback/weather.jpg") {
                              target.src = "/fallback/weather.jpg";
                            }
                          }}
                        />
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        
                        <div className="absolute left-4 top-4 rounded-xl bg-white/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                          {post.category}
                        </div>
                      </div>

                      <div className="mb-6 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-1">
                         <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-white/40" />
                           {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                         </div>
                         <div className="flex items-center gap-2">
                           <Clock className="h-4 w-4 text-white/40" />
                           {readTime} Min
                         </div>
                      </div>

                      <h2 className="mb-4 text-3xl font-black leading-[1.2] text-white tracking-tight transition-colors group-hover:text-white/90">
                        {post.title}
                      </h2>

                      <p className="mb-10 flex-1 text-lg leading-relaxed text-white/40 font-medium line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-8">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                          Scientific Digest
                          <Sparkles className="h-3 w-3" />
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 group-hover:bg-white group-hover:text-slate-900 group-hover:rotate-45">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <GlassCard className="mb-10 rounded-[2.5rem] p-10">
            <Filter className="h-16 w-16 text-white/10" />
          </GlassCard>
          <h3 className="text-3xl font-black text-white tracking-tight">Intelligence Not Found</h3>
          <p className="mt-4 text-xl text-white/30 font-medium">Try broadening your search criteria.</p>
          <GlassCard 
            as="button"
            onClick={() => { setSearch(""); setActiveCategory("All"); }}
            className="mt-10 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-slate-900"
          >
            Clear All
          </GlassCard>
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredPosts.length > displayCount && (
        <div className="flex justify-center pt-12">
          <GlassCard 
            as="button"
            onClick={() => setDisplayCount(prev => prev + 3)}
            className="group relative overflow-hidden rounded-[2rem] px-12 py-6 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <span className="relative z-10">Sync More Insights</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white opacity-0 transition-opacity group-hover:opacity-100" />
          </GlassCard>
        </div>
      )}
    </div>
  );
}
