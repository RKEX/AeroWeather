import GlassCard from "@/components/ui/GlassCard";

interface LongTextBlockProps {
  title: string;
  content: string;
  className?: string;
  isHtml?: boolean;
}

export function LongTextBlock({ title, content, className = "", isHtml = false }: LongTextBlockProps) {
  return (
    <GlassCard className={`p-8 md:p-12 ${className}`}>
      <h2 className="mb-6 text-2xl font-bold md:text-3xl text-white">{title}</h2>
      {isHtml ? (
        <div 
          className="prose prose-invert max-w-none text-white/70 
          prose-headings:text-white prose-headings:font-bold 
          prose-p:leading-relaxed prose-p:mb-4
          prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
          prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="space-y-4 text-white/70 leading-relaxed text-lg">
          {content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
