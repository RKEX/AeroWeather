"use client";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-content";
import { Link } from "@/navigation";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

// --- Header Component ---
export function BlogHeader({ post }: { post: BlogPost }) {
  const wordsPerMinute = 200;
  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute) + 1;

  return (
    <div className="mb-10">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <span className="rounded-full bg-white/5 border border-white/10 px-5 py-2 text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
          {post.category}
        </span>
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40">
          <Clock className="h-4 w-4 text-white/40" />
          {readTime} Minute Precision Read
        </div>
      </div>
      
      <h1 className="mb-10 text-4xl font-black text-white md:text-6xl lg:text-7xl leading-[1.05] tracking-tighter">
        {post.title}
      </h1>

      <div className="flex items-center gap-6 border-b border-white/5 pb-12">
        <GlassCard className="group relative flex h-14 w-14 items-center justify-center overflow-hidden shadow-none">
          <User className="h-6 w-6 text-white/70" />
        </GlassCard>
        <div className="flex flex-col">
          <p className="text-lg font-black text-white tracking-tight">{post.author}</p>
          <div className="flex items-center gap-3 mt-1 text-xs font-bold uppercase tracking-widest text-white/30">
              <Calendar className="h-3.5 w-3.5 text-white/40" />
             <time dateTime={post.date}>
               {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
             </time>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Image Component ---
export function BlogImage({ 
  keywords, 
  alt, 
  src,
  priority = false,
  className = "" 
}: { 
  keywords: string[]; 
  alt: string; 
  src?: string;
  priority?: boolean;
  className?: string;
}) {
  const query = keywords.length > 0 ? keywords[0] : "weather";
  const imageUrl = src || "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80";

  return (
    <GlassCard className={`relative min-h-[260px] overflow-hidden bg-slate-950 ${className}`}>
      <div className="aspect-[21/9] w-full bg-white/5" />
      <img
        src={imageUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
        loading={priority ? "eager" : "lazy"}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== "/fallback/weather.jpg") {
            target.src = "/fallback/weather.jpg";
          }
        }}
      />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </GlassCard>
  );
}

// --- Related Posts ---
export function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = BLOG_POSTS
    .filter(p => p.slug !== currentSlug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);

  return (
    <section className="mt-32 border-t border-white/10 pt-20">
      <div className="mb-14 flex items-center justify-between">
        <h2 className="text-3xl font-black text-white tracking-tighter">Expand Knowledge</h2>
        <Link 
          href="/blog" 
          className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          Archive
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {related.map((post) => (
          <GlassCard 
            key={post.slug} 
            as="div"
            className="group flex flex-col gap-6 p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20"
          >
            <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20" />
             <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={post.image || "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=800&auto=format&fit=crop"}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/fallback/weather.jpg") {
                      target.src = "/fallback/weather.jpg";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white bg-white/20 px-4 py-2 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform">Read Insight</span>
                </div>
             </div>
             <div>
               <span className="mb-3 block text-[10px] font-black uppercase tracking-widest text-white/50">
                  {post.category}
               </span>
                <h3 className="text-2xl font-black text-white leading-tight transition-colors group-hover:text-white/90">
                  {post.title}
                </h3>
               <p className="mt-4 text-lg text-white/40 font-medium line-clamp-2 leading-relaxed">
                 {post.excerpt}
               </p>
             </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// --- Schema.org Component ---
export function BlogSchema({ post, url }: { post: BlogPost; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "keywords": post.keywords.join(","),
    "articleSection": post.category,
    "author": {
      "@type": "Person",
      "name": "AeroWeather Meteorology Team",
      "url": "https://www.aeroweather.app/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AeroWeather",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.aeroweather.app/public/logo.png"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "image": {
      "@type": "ImageObject",
      "url": post.coverImage || post.image || "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80",
      "width": 1200,
      "height": 675
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
