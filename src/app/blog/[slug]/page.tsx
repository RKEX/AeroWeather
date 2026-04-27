import { BlogHeader, BlogImage, BlogSchema, RelatedPosts } from "@/components/blog/blog-ui";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TableOfContents } from "@/components/blog/table-of-contents";
import GlassCard from "@/components/ui/GlassCard";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-content";
import { Link } from "@/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return generateMetadataFromConfig({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    pathname: `/blog/${slug}`,
    image: post.coverImage || post.image,
    type: "article",
    keywords: post.keywords,
  });
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

function processBlogContent(content: string, keywords: string[], title: string) {
  const paragraphs = content.split('</p>');
  let processed = "";
  let currentWords = 0;
  let imgCount = 0;

  paragraphs.forEach((p, i) => {
    if (p.trim() === "") return;
    const cleanP = p + "</p>";
    processed += cleanP;
    
    // Simple word count
    currentWords += cleanP.replace(/<[^>]*>/g, "").split(/\s+/).length;

    // Inject image every ~350 words, but not too close to the end
    if (currentWords >= 350 && i < paragraphs.length - 2) {
      const kw = keywords[imgCount % keywords.length] || "weather";
      const altText = `${title} - ${kw} visualization`;
      const safeKw = encodeURIComponent(kw);
      processed += `
        <figure class="my-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img 
            src="https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=800&auto=format&fit=crop" 
            alt="${altText}" 
            loading="lazy"
            onerror="if (this.src !== '/fallback/weather.jpg') this.src='/fallback/weather.jpg';"
            class="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
          />
          <figcaption class="p-6 text-center text-xs text-white/30 uppercase tracking-[0.3em] font-black italic">
            Visual Guide: Understanding ${kw} in atmospheric science
          </figcaption>
        </figure>
      `;
      currentWords = 0;
      imgCount++;
    }
  });

  return processed;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const fullUrl = `https://www.aeroweather.app/blog/${slug}`;
  const processedContent = processBlogContent(post.content, post.keywords, post.title);
  const ctas: Array<{ name: string; href: "/impact" | "/love" | "/travel" | "/meditation"; color: string }> = [
    { name: "Impact Calendar", href: "/impact", color: "from-blue-500 to-cyan-500" },
    { name: "Love Insights", href: "/love", color: "from-pink-500 to-rose-500" },
    { name: "Travel Planning", href: "/travel", color: "from-amber-500 to-orange-500" },
    { name: "Mood Sync", href: "/meditation", color: "from-indigo-500 to-purple-500" },
  ];

  console.log(`[Blog Detail Debug] slug: ${slug}, cover: ${post.coverImage}, img: ${post.image}`);

  return (
    <div className="relative min-h-screen bg-transparent pt-12 md:pt-20">
      <BlogSchema post={post} url={fullUrl} />
      
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* --- LEFT SIDEBAR (Sticky) --- */}
          <aside className="hidden lg:block lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit space-y-12">
            <GlassCard
              as="div"
              className="group"
            >
              <Link 
                href="/blog" 
                className="inline-flex h-12 w-full items-center gap-3 px-6 text-sm font-bold text-white/40 transition-all hover:bg-white hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Portal
              </Link>
            </GlassCard>
            
            <GlassCard className="p-6">
              <TableOfContents content={post.content} />
            </GlassCard>

            <GlassCard className="p-6">
              <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-white/40">Distribute Insight</h4>
              <ShareButtons url={fullUrl} title={post.title} />
            </GlassCard>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <article className="flex-1 max-w-[760px] mx-auto lg:mx-0">
            <header className="mb-12">
              <Link 
                href="/blog" 
                className="lg:hidden mb-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Knowledge Base
              </Link>

              <BlogHeader post={post} />
              
              <div className="mt-10 group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <BlogImage 
                  keywords={post.keywords} 
                  alt={post.title} 
                  src={post.coverImage || post.image}
                  priority={true} 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute bottom-6 left-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 opacity-0 transition-all delay-100 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
                  Atmospheric Insight #{post.slug.length}
                </div>
              </div>
            </header>

            <main 
              className="prose prose-invert max-w-none 
              prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-headings:mt-16 prose-headings:mb-8
              prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4
              prose-h3:text-2xl md:prose-h3:text-3xl
              prose-p:text-white/60 prose-p:leading-[1.9] prose-p:text-xl md:prose-p:text-2xl prose-p:mb-10 prose-p:font-medium
              prose-ul:list-disc prose-ul:ml-8 prose-ul:mb-10 prose-ul:space-y-4
              prose-li:text-white/60 prose-li:text-lg md:prose-li:text-xl
              prose-strong:text-white prose-strong:font-black
              prose-blockquote:border-l-4 prose-blockquote:border-white/20 prose-blockquote:bg-white/5 prose-blockquote:px-10 prose-blockquote:py-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-white/80 prose-blockquote:italic
              prose-a:text-white/80 prose-a:font-bold prose-a:no-underline hover:prose-a:text-white hover:prose-a:underline transition-all underline-offset-4
              prose-img:rounded-2xl prose-img:border prose-img:border-white/10"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* --- CONTEXTUAL CTA BLOCK --- */}
            <section className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
                  Plan Smarter with AeroWeather
                </h2>
                <p className="text-xl text-white/50 font-medium mb-10 max-w-xl leading-relaxed">
                  Go beyond the forecast. See exactly how the atmosphere impacts your productivity, relationships, and global travel in real-time.
                </p>
                <div className="flex flex-wrap gap-4">
                  {ctas.map((cta) => (
                    <Link 
                      key={cta.name}
                      href={cta.href}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-black uppercase tracking-widest text-white/70 hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300"
                    >
                      {cta.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
            </section>

            <div className="lg:hidden mt-20 border-t border-white/10 pt-16">
               <h4 className="mb-8 text-center text-[10px] font-black uppercase tracking-widest text-white/40">Share with the World</h4>
               <div className="flex justify-center">
                 <ShareButtons url={fullUrl} title={post.title} />
               </div>
            </div>

            <RelatedPosts currentSlug={slug} />
          </article>
        </div>
      </div>

      <footer className="mt-40 border-t border-white/10 py-32 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/70">
             <User className="h-10 w-10" />
          </div>
          <h3 className="mb-6 text-3xl font-black text-white tracking-tight md:text-5xl">The Mission of <span className="text-white/90">AeroWeather</span></h3>
          <p className="text-xl leading-[1.8] text-white/40 font-medium">
            Bridging the divide between raw atmospheric telemetry and daily human safety. Our platform utilizes elite meteorological models to translate billion-point datasets into clear, actionable, and visual narratives. We are dedicated to providing the world with the clarity needed to navigate a changing climate.
          </p>
          <GlassCard className="mt-12 inline-flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold text-white/30 uppercase tracking-widest shadow-none">
            Verified Educational Resource
          </GlassCard>
        </div>
      </footer>
    </div>
  );
}
