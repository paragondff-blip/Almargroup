import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Policy() {
  const { slug } = useParams();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/footer")
      .then(res => res.json())
      .then(data => {
        // match by path considering the leading slash or without
        const match = data.policies?.find((p: any) => p.path === `/policy/${slug}` || p.path === `/${slug}` || p.path === slug);
        setPolicy(match);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-bold text-gray-500 uppercase tracking-widest">Loading Policy...</div>;

  if (!policy) return <div className="p-20 text-center font-bold text-gray-500 uppercase tracking-widest">Policy Not Found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-primary pt-32 pb-16 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{policy.name}</h1>
        <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase text-blue-200">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Policy</span>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
          {policy.content || "Content not available."}
        </div>
      </div>
    </div>
  );
}
